/**
 * Aqui manejo la autenticacion: registro, login, perfil actual y logout con cookie de sesion.
 */
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const AUTH_COOKIE_NAME = 'authToken'
const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

const getAuthCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  // En local usamos 'lax'; en producción cross-site suele requerir 'none'.
  const sameSite =
    process.env.COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax')

  return {
    httpOnly: true,
    secure: isProduction || process.env.COOKIE_SECURE === 'true',
    sameSite,
    maxAge: TOKEN_MAX_AGE_MS,
    path: '/',
  }
}

const getClearCookieOptions = () => {
  // Para limpiar cookie, deben coincidir los mismos flags (excepto maxAge).
  const clearOptions = getAuthCookieOptions()
  delete clearOptions.maxAge
  return clearOptions
}

const signAuthToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()
    const normalizedUsername = username?.trim()

    if (!normalizedEmail || !normalizedUsername || !password) {
      return res.status(400).json({ message: 'Datos incompletos' })
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no configurado')
      return res
        .status(500)
        .json({ message: 'Error de configuración del servidor' })
    }

    const existsByEmail = await User.findOne({ email: normalizedEmail })
    if (existsByEmail) {
      return res.status(400).json({ message: 'Usuario ya existe' })
    }
    const existsByUsername = await User.findOne({
      username: normalizedUsername,
    })
    if (existsByUsername) {
      return res.status(400).json({ message: 'Usuario ya existe' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    })

    const token = signAuthToken(user._id)
    // El navegador guarda la sesión en cookie httpOnly (no accesible desde JS).
    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions())

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || 'user',
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
    const rawIdentifier =
      typeof email === 'string'
        ? email
        : typeof username === 'string'
          ? username
          : ''
    const identifier = rawIdentifier.trim()

    if (!identifier || typeof password !== 'string' || !password) {
      return res.status(400).json({ message: 'Credenciales inválidas' })
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no configurado')
      return res
        .status(500)
        .json({ message: 'Error de configuración del servidor' })
    }

    const isEmail = identifier.includes('@')
    const user = await User.findOne(
      isEmail ? { email: identifier.toLowerCase() } : { username: identifier },
    )
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' })
    }

    if (!user.password) {
      console.error('Usuario sin password almacenado', user._id)
      return res.status(500).json({ message: 'Error en login' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(400).json({ message: 'Credenciales inválidas' })
    }

    const token = signAuthToken(user._id)
    // La sesión queda en cookie; el frontend solo refresca usuario con /auth/me.
    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions())

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || 'user',
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error en login' })
  }
}

const me = (req, res) => {
  const user = req.user

  if (!user) {
    return res.status(401).json({ message: 'Usuario no encontrado' })
  }

  res.json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role || 'user',
    },
  })
}

const logout = (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, getClearCookieOptions())
  res.status(204).send()
}

module.exports = { register, login, me, logout }
