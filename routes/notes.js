const { routerModelBuilder } = require('../helpers/route')
const schema = require('../schemas/notes')

const router = routerModelBuilder(
  schema, 200,
)

module.exports = router;
