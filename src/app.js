import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import messagesRouter from './routes/messages.router.js';
import viewsRouter from './routes/views.router.js';
import dotenv from 'dotenv';
import __dirname from './utils.js';
import socketProducts from './socketProducts.js';

dotenv.config();
console.log(`Mongo URL: ${process.env.MONGO_URL}`);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Conectado a la base de datos');
    })
    .catch(error => console.error('Error en la conexión', error));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/messages', messagesRouter);
app.use('/', viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const io = new Server(httpServer);

socketProducts(io); 
