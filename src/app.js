require('./config/env')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const recipeRoutes = require('./routes/recipeRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()

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
      if (
        originAllowlist.includes(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true)
      }
      return callback(null, false)
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/recipes', recipeRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API OK' })
})

module.exports = app
