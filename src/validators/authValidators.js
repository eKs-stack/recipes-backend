/**
 * Aqui defino las reglas de validacion para registro e inicio de sesion.
 */
const { body } = require('express-validator')

const registerValidation = [
  body('username')
    .isString()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username inválido'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password')
    .isString()
    .isLength({ min: 6, max: 128 })
    .withMessage('Password inválido'),
]

const loginValidation = [
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('username')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username inválido'),
  body('password')
    .isString()
    .isLength({ min: 6, max: 128 })
    .withMessage('Password inválido'),
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.username) {
      throw new Error('Email o username requerido')
    }
    return true
  }),
]

module.exports = { registerValidation, loginValidation }
