import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

dotenv.config();

logger.info(`Mongo URL: ${process.env.MONGODB_URL}`);

mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;

db.on("error", (error) => {
  logger.error("Connection error:", error);
});
db.once("open", () => {
  logger.info("Connected to MongoDB");
});

export default {
  port: process.env.PORT || 8080,
  mongoURI: process.env.MONGODB_URL,
  sessionSecret: process.env.SESSION_SECRET || "secretkey",
};
