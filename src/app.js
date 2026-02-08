require('./config/env')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const csrfProtection = require('./middlewares/csrfProtection')

const recipeRoutes = require('./routes/recipeRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()

app.set('trust proxy', 1)

app.use(helmet())
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://guardatureceta.com',
  'https://www.guardatureceta.com',
]
const originAllowlist = allowedOrigins.length ? allowedOrigins : defaultOrigins
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (originAllowlist.includes(origin)) {
        return callback(null, true)
      }
      return callback(null, false)
    },
    credentials: true,
  }),
)
app.use(csrfProtection({ allowedOrigins: originAllowlist }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/auth', authRoutes)
app.use('/api/recipes', recipeRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API OK' })
})

module.exports = app
