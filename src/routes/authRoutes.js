const express = require('express')
const router = express.Router()
const { register, login, me, logout } = require('../controllers/authController')
const auth = require('../middlewares/auth')
const validate = require('../middlewares/validate')
const {
  registerValidation,
  loginValidation,
} = require('../validators/authValidators')

router.get('/me', auth, me)
router.post('/register', registerValidation, validate, register)
router.post('/login', loginValidation, validate, login)
router.post('/logout', logout)

module.exports = router
