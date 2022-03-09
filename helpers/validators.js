const validateGetParams = (schema) => {
  return (req, res, next) => {
    try {
      res.locals.columns = schema.columns
      res.locals.limit = null
      res.locals.offset = null
      res.locals.order = [{ column: schema.identity, sort: 'ASC' }]

      if (req.query.columns) {
        const columns = req.query.columns?.split(',')
          .map(column => column.trim())
          .filter(column => schema.columns.includes(column));

        res.locals.columns = columns?.length ? columns : res.locals.columns
      }

      if (req.query.order) {
        const order = req.query.order?.split(',')
          .map(item => {
            const [column, sort] = item.trim().split('|')
            return {
              column,
              sort: ['ASC', 'DESC'].includes(sort?.toUpperCase()) ? sort.toUpperCase() : 'ASC'
            }
          })
          .filter(item => schema.columns.includes(item.column));

        res.locals.order = order?.length ? order : res.locals.order
      }

      if (req.query.limit) {
        res.locals.limit = Number(req.query.limit) || null
      }

      if (req.query.offset) {
        res.locals.offset = Number(req.query.offset) || null
      }

      next()
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ error: err.message })
      } else {
        res.status(400).json({ error: 'Unknown error' })
      }
    }
  }
}

module.exports = {
  validateGetParams
}