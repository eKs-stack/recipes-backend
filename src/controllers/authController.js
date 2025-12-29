const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ message: 'Usuario ya existe' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(400).json({
      message: 'Error registrando usuario',
      error: error.message,
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(400).json({ message: 'Credenciales inválidas' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch {
    res.status(400).json({ message: 'Error en login' })
  }
}

module.exports = { register, login }
