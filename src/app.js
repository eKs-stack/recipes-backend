const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const recipeRoutes = require('./routes/recipeRoutes')

app.get('/', (req, res) => {
  res.json({ message: 'API Recipes funcionando' })
})

app.use('/api/recipes', recipeRoutes)

module.exports = app