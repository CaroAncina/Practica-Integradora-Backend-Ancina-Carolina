import express from "express";
import dotenv from "dotenv";
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
import { specs, swaggerUiExpress } from "./utils/swagger.js";

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
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("public/uploads"));

const hbs = handlebars.create({
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
    multiply: function (a, b) {
      return a * b;
    },
    json: function (context) {
      return JSON.stringify(context, null, 2);
    },
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

app.engine("handlebars", hbs.engine);
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "handlebars");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(errorHandler);

app.use("/api/users", usersRoutes);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/", viewsRouter);
app.use("/api/mockingproducts", mockingProducts);
app.use("/api/loggerTest", loggerTest);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

const httpServer = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
const io = new Server(httpServer);

socketProducts(io);
