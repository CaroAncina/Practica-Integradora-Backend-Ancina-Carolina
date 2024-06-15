import express from 'express';
import mongoose from './config/database.js';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import productsRouter from './routes/api/products.router.js';
import cartsRouter from './routes/api/carts.router.js';
import messagesRouter from './routes/api/messages.router.js';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/api/sessions.router.js';
import __dirname from './utils.js';
import socketProducts from './public/js/socketProducts.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';

const app = express();
const PORT = 8080;

// Middleware para JSON, URL y archivos estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Handlebars 
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Middleware de sesión
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB }),
    cookie: { maxAge: 180 * 60 * 1000 }, 
}));

// Inicializar Passport 
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/messages', messagesRouter);
app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);

// Inicializar servidor HTTP y configurar Socket.IO
const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const io = new Server(httpServer);

socketProducts(io);
