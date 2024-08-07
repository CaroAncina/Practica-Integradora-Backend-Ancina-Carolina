import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error(err);
  res
    .status(500)
    .json({ status: "error", message: err.message, code: err.code });
};

export default errorHandler;
