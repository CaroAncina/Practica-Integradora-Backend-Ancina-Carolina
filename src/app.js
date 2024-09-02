import express from "express";
import mongoose from "./config/database.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import socketProducts from "./public/js/socketProducts.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import errorHandler from "./middleware/errorhandler.js";
import logger from "./utils/logger.js";
import swaggerJsdoc from "swagger-jsdoc";
import SwaggerUiExpress from "swagger-ui-express";

// Importar Rutas
import usersRoutes from "./routes/api/usersRouter.js";
import cartsRouter from "./routes/api/cartsRouter.js";
import productsRouter from "./routes/api/productsRouter.js";
import messagesRouter from "./routes/api/messagesRouter.js";
import sessionsRouter from "./routes/api/sessionsRouter.js";
import ticketsRouter from "./routes/api/ticketsRouter.js";
import viewsRouter from "./routes/views/viewsRouter.js";
import mockingProducts from "./routes/api/mockingProducts.js";
import loggerTest from "./routes/api/loggerTest.js";

const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para JSON, URL y archivos estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/public")));

// Handlebars
const hbs = handlebars.create({
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
  },
});

app.engine("handlebars", hbs.engine);
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "handlebars");

// Middleware de sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);

//Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación ecommerce Antojitos ",
      description: "API para documentar ecommerce del proyecto de backend",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/apidocs", SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs));

// Inicializar Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(errorHandler);

// Rutas
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/", viewsRouter);
app.use("/api/mockingproducts", mockingProducts);
app.use("/api/loggerTest", loggerTest);

// Inicializar servidor HTTP y configurar Socket.IO
const httpServer = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
const io = new Server(httpServer);

socketProducts(io);
