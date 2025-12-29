const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()
    const normalizedUsername = username?.trim()

    if (!normalizedEmail || !normalizedUsername || !password) {
      return res.status(400).json({ message: 'Datos incompletos' })
    }

    const existsByEmail = await User.findOne({ email: normalizedEmail })
    if (existsByEmail) {
      return res.status(400).json({ message: 'Usuario ya existe' })
    }
    const existsByUsername = await User.findOne({ username: normalizedUsername })
    if (existsByUsername) {
      return res.status(400).json({ message: 'Usuario ya existe' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
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
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, username, password } = req.body
    const identifier = (email || username || '').trim()

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Credenciales inválidas' })
    }

    const isEmail = identifier.includes('@')
    const user = await User.findOne(
      isEmail
        ? { email: identifier.toLowerCase() }
        : { username: identifier },
    )
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
