const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/authController')
const validate = require('../middlewares/validate')
const {
  registerValidation,
  loginValidation,
} = require('../validators/authValidators')

router.post('/register', registerValidation, validate, register)
router.post('/login', loginValidation, validate, login)

module.exports = router
