const Joi = require('joi')
const { routerModelBuilder } = require('../helpers/route')
const database = require('../services/database')
const schema = require('../schemas/login')

const sameUserMiddleware = (req, res, next) => {
  try {
    const idloginSql = {
      toSqlString: () => Number(req.params.id) ? `AND ${schema.identity} != ${database.escape(Number(req.params.id))}` : ''
    }

    const { value: item, error } = Joi.object().keys(
      {
        login: schema.fieldsValidate.login.required()
      }
    ).validate(req.body, { allowUnknown: true })

    if (error) return res.status(400).send({ error: error.details.map(({ message }) => message) })

    database.query(
      `SELECT ${schema.identity} FROM ${schema.table} WHERE login = ? ?`,
      [item.login, idloginSql],
      (error, results) => {
        if (error) return res.status(400).json({ error })
        if (!results?.length) return next()
        return res.status(400).json({ error: 'There is already a user with this login in the database' })
      }
    )

  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message })
    } else {
      res.status(400).json({ error: 'Unknown error' })
    }
  }
}

const router = routerModelBuilder(
  schema, 20,
  {
    insert: [sameUserMiddleware],
    update: [sameUserMiddleware]
  }
)

router.post('/realizarlogin', (req, res, next) => {
  try {
    const { value: item, error } = Joi.object().keys(
      {
        login: Joi.string().required(),
        senha: Joi.string().required(),
      }
    ).validate(req.body)

    if (error) return res.send({ error: error.details.map(({ message }) => message) })

    database.query(
      `SELECT ${schema.identity} FROM ${schema.table} WHERE login = ? AND senha = ?`,
      [item.login, item.senha],
      (error, results) => {
        if (error) return res.status(400).json({ error })
        if (!results?.length) return res.status(400).json({ error: 'There is no user with these credentials' })
        return res.json({ message: 'OK' })
      }
    )

  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message })
    } else {
      res.status(400).json({ error: 'Unknown error' })
    }
  }
})

module.exports = router;
