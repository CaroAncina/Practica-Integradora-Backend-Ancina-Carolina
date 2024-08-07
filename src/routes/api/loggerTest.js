import { Router } from "express";
import { addLogger } from "../../utils/logger.js";

const router = Router();

router.use(addLogger);

router.get("/", (req, res) => {
  req.logger.debug("Debug log");
  req.logger.http("HTTP log");
  req.logger.info("Info log");
  req.logger.warning("Warning log");
  req.logger.error("Error log");
  req.logger.fatal("Fatal log");
});

export default router;
