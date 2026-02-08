/**
 * Aqui gestiono la conexion a MongoDB y reutilizo la conexion para no abrir sockets de mas.
 */
const mongoose = require('mongoose')

// Cachea la conexión para evitar múltiples sockets en dev/serverless.
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongooseInstance) => {
        console.log('MongoDB conectado')
        return mongooseInstance
      })
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    cached.promise = null
    console.error('Error conectando a MongoDB', error.message)
    throw error
  }
}

module.exports = connectDB
