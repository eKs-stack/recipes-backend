require('./config/env')
const app = require('./app')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 3000

const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
  })
}

startServer().catch((error) => {
  console.error('Error iniciando servidor', error)
  process.exit(1)
})
