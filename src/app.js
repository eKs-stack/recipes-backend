const express = require('express')
const cors = require('cors')

const recipeRoutes = require('./routes/recipeRoutes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json({ message: 'API OK' })
})

app.use('/api/recipes', recipeRoutes)

module.exports = app
