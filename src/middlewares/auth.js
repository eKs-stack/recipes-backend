/**
 * En este middleware valido el token (Bearer o cookie), verifico el JWT y adjunto req.user.
 */
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const AUTH_COOKIE_NAME = 'authToken'

const parseCookies = (cookieHeader = '') => {
  if (!cookieHeader) return {}

  // Parser simple para evitar dependencia extra solo para leer authToken.
  return cookieHeader.split(';').reduce((cookies, pair) => {
    const [rawKey, ...rawValueParts] = pair.split('=')
    if (!rawKey) return cookies

    const key = rawKey.trim()
    const rawValue = rawValueParts.join('=').trim()
    if (!key) return cookies

    try {
      cookies[key] = decodeURIComponent(rawValue)
    } catch {
      cookies[key] = rawValue
    }

    return cookies
  }, {})
}

const auth = async (req, res, next) => {
  try {
    // Compatibilidad: token por Bearer (Postman) o por cookie de sesión.
    const header = req.headers.authorization
    const bearerToken =
      header && header.startsWith('Bearer ') ? header.split(' ')[1] : null
    const cookieToken = parseCookies(req.headers.cookie)[AUTH_COOKIE_NAME]
    const token = bearerToken || cookieToken

    if (!token) {
      return res.status(401).json({ message: 'No token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido' })
  }
}

module.exports = auth
