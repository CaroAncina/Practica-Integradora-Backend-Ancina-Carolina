import express from 'express'
import mongoose from 'mongoose'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import messagesRouter from './routes/messages.router.js'
import dotenv from 'dotenv'

dotenv.config()
console.log(process.env.MONGO_URL)

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("Conectado a la base de datos") })
    .catch(error => console.error("Error en la conexion", error))

app.use('/api/products', productsRouter)
app.use('/api/carts',cartsRouter)
app.use('/api/messages',messagesRouter)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})