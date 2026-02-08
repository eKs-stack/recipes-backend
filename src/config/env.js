/**
 * En este archivo cargo las variables de entorno desde .env.
 */
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') })
