const Joi = require('joi')
  .extend(require('@joi/date'))

const fieldsValidate = {
  id_notes: Joi.number()
    .integer()
    .positive(),

  title: Joi.string()
    .min(3)
    .max(50)
    .trim(),

  description_task: Joi.string()
    .min(3)
    .max(255)
    .trim(),

  concluded: Joi.number()
    .integer()
    .max(1)
    .min(0),

  deadline: Joi.date()
    .format(['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'])
    .raw(),

  created: Joi.date()
    .format(['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'])
    .raw(),

  priority: Joi.number()
    .integer(),
}

const requiredColumns = [
  'id_notes',
  'title',
  'description_task',
  'concluded',
  'deadline',
  'created',
  'priority'
]

const identity = 'id_notes'

module.exports = {
  table: 'notes',
  identity,
  fieldsValidate,
  requiredColumns,
  columns: Object.keys(fieldsValidate)
}