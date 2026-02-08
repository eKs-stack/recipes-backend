/**
 * Aqui centralizo los errores de validacion y devuelvo respuestas 400 consistentes.
 */
const { validationResult } = require('express-validator')

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Datos inválidos',
      errors: errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      })),
    })
  }
  next()
}

module.exports = validate
