const express = require('express')
const Joi = require('joi')
const queryString = require('query-string')
const database = require('../services/database')
const { validateGetParams } = require('./validators')

function routerModelBuilder(schema, limitDefault = 20, middlewares = {}) {
  const router = express.Router()
  const listMiddlewares = middlewares.list ? middlewares.list : []
  const detailMiddlewares = middlewares.detail ? middlewares.detail : []
  const insertMiddlewares = middlewares.insert ? middlewares.insert : []
  const updateMiddlewares = middlewares.update ? middlewares.update : []
  const deleteMiddlewares = middlewares.delete ? middlewares.delete : []

  router.get('/', validateGetParams(schema), ...listMiddlewares, async (req, res) => {
    const { columns, limit, offset, order } = res.locals

    const limitSql = {
      toSqlString: () => limit || limitDefault ? `LIMIT ${limit || limitDefault}` : ''
    }
    const offsetSql = {
      toSqlString: () => offset && (limit || limitDefault) ? `OFFSET ${offset}` : ''
    }
    const orderSql = {
      toSqlString: () => order ?
        `ORDER BY ${order.map(({ column, sort }) => `${column} ${sort}`).join(',')}` : ''
    }

    const nullCountFieldSql = {
      toSqlString: () => `NULL AS ${database.escapeId('sql_count')}`
    }

    const columnsCount = `COUNT(*) AS ${database.escapeId('sql_count')}, ${columns.map((column) => 'NULL AS ' + database.escapeId(column))}`
    const countSql = {
      toSqlString: () =>
        `(SELECT ${columnsCount} FROM ${schema.table})`
    }

    database.query(
      `(SELECT ?, ?? FROM ${schema.table} ? ? ?) UNION (?)`,
      [nullCountFieldSql, columns, orderSql, limitSql, offsetSql, countSql],
      (error, results) => {
        if (error) return res.status(400).json({ error })

        const countRow = results.pop()

        const baseUrl = `${req.protocol}://${req.get('host') + req.baseUrl}?`

        const limitPagination = limit || limitDefault
        const offsetNext = +offset + (limit || limitDefault)
        const offsetPrevious = Math.max(+offset - (limit || limitDefault), 0)

        const nextUrl = offsetNext < countRow.sql_count ?
          baseUrl + queryString.stringify({ ...req.query, limit: limitPagination, offset: offsetNext }) : null

        const previousUrl = offsetPrevious !== +offset ?
          baseUrl + queryString.stringify({ ...req.query, limit: limitPagination, offset: offsetPrevious }) : null

        res.send({
          count: countRow.sql_count,
          next: nextUrl,
          previous: previousUrl,
          results: results.map(({ sql_count, ...row }) => row)
        })
      }
    )
  })

  router.get('/:id', validateGetParams(schema), ...detailMiddlewares, async (req, res) => {
    const { columns } = res.locals

    const id = Number(req.params.id) || null

    if (!id) return res.status(400).json({ error: "Required int parameter 'id' is not present" })

    database.query(
      `SELECT ?? FROM ${schema.table} WHERE ${schema.identity} = ?`, [columns, id],
      (error, results) => {
        if (error) return res.status(400).json({ error })
        if (!results?.length) return res.status(404).json({ error: `No records were found with ${schema.identity} = ${id}` })
        res.send(results[0])
      }
    )
  })

  router.post('/', ...insertMiddlewares, async (req, res) => {
    const fieldsValidate = {
      ...schema.fieldsValidate,
      ...schema.requiredColumns.reduce((acc, cur) => {
        acc[cur] = schema.fieldsValidate[cur].required()
        return acc
      }, {})
    }

    if (!schema.noDefaultValueIdentity) {
      delete fieldsValidate[schema.identity]
    }

    const { value: item, error } = await Joi.object().keys(fieldsValidate).validate(req.body, { abortEarly: false })

    if (error) return res.status(400).json({ error: error.details.map(({ message }) => message) })

    database.query(
      `INSERT INTO ${schema.table} SET ?`, item,
      (error, results) => {
        if (error) return res.status(400).json({ error })
        if (!results?.insertId && !schema.noDefaultValueIdentity) return res.status(400).json({ error: `Unknown error inserting into ${schema.table} table` })
        res.send({ [schema.identity]: results.insertId, ...item })
      }
    )
  })

  router.patch('/:id', ...updateMiddlewares, async (req, res) => {
    const id = Number(req.params.id) || null

    if (!id) return res.status(400).json({ error: "Required int parameter 'id' is not present" })

    const fieldsValidate = {
      ...schema.fieldsValidate
    }

    if (!schema.noDefaultValueIdentity) {
      delete fieldsValidate[schema.identity]
    }

    const { value: item, error } = await Joi.object().keys(fieldsValidate).validate(req.body, { abortEarly: false })

    if (error) return res.send({ error: error.details.map(({ message }) => message) })

    database.query(
      `UPDATE ${schema.table} SET ? WHERE ${schema.identity} = ?`, [item, id],
      (error, results) => {
        if (error) return res.status(400).json({ error })
        res.send({ [schema.identity]: id, ...item })
      }
    )
  })

  router.delete('/:id', ...deleteMiddlewares, async (req, res) => {
    const id = Number(req.params.id) || null

    if (!id) return res.status(400).json({ error: "Required int parameter 'id' is not present" })

    database.query(
      `DELETE FROM ${schema.table} WHERE ${schema.identity} = ?`, [id],
      (error, results) => {
        if (error) return res.status(400).json({ error })
        res.status(204).send({})
      }
    )
  })

  return router
}

module.exports = {
  routerModelBuilder
};
