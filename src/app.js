require('./config/env')
const express = require('express')
const cors = require('cors')

const recipeRoutes = require('./routes/recipeRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/recipes', recipeRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API OK' })
})

module.exports = app
