const AUTH_COOKIE_NAME = 'authToken'
const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

const hasAuthCookie = (cookieHeader = '') =>
  cookieHeader
    .split(';')
    .map((part) => part.trim())
    .some((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`))

const getRefererOrigin = (referer = '') => {
  if (!referer) return null

  try {
    return new URL(referer).origin
  } catch {
    return null
  }
}

const csrfProtection = ({ allowedOrigins = [] } = {}) => {
  const normalizedOrigins = allowedOrigins
    .map((origin) => origin.trim())
    .filter(Boolean)
  const originAllowlist = new Set(normalizedOrigins)

  return (req, res, next) => {
    // GET/HEAD/OPTIONS no cambian estado: no requieren validación CSRF.
    if (!UNSAFE_METHODS.has(req.method)) {
      return next()
    }

    // Si no hay cookie de sesión, no hay contexto autenticado que proteger.
    if (!hasAuthCookie(req.headers.cookie)) {
      return next()
    }

    const requestOrigin =
      req.headers.origin || getRefererOrigin(req.headers.referer)
    if (!requestOrigin || !originAllowlist.has(requestOrigin)) {
      return res.status(403).json({ message: 'Origen no permitido (CSRF)' })
    }

    next()
  }
}

module.exports = csrfProtection
