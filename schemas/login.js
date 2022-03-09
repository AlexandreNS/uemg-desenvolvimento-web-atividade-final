const Joi = require('joi')

const fieldsValidate = {
  idlogin: Joi.number()
    .integer()
    .positive(),

  login: Joi.string()
    .min(3)
    .max(45)
    .trim(),

  senha: Joi.string()
    .min(3)
    .max(8)
    .trim(),

  nome: Joi.string()
    .min(3)
    .max(45)
    .trim(),

  sobrenome: Joi.string()
    .min(3)
    .max(45)
    .trim()
}

const requiredColumns = [
  'idlogin',
  'login',
  'senha'
]

const identity = 'idlogin'

module.exports = {
  table: 'login',
  identity,
  fieldsValidate,
  requiredColumns,
  columns: Object.keys(fieldsValidate)
}

