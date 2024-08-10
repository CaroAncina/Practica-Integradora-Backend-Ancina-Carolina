import { Router } from "express";
import viewsController from "../../controllers/viewsController.js";
import {
  isAuthenticated,
  isNotAuthenticated,
  isPremium,
} from "../../middleware/auth.js";

const router = Router();

router.get("/", viewsController.redirectToLogin);
router.get("/products", isAuthenticated, viewsController.getProductsPage);
router.get(
  "/products/:pid",
  isAuthenticated,
  viewsController.getProductDetails
);
router.get(
  "/realTimeProducts",
  isAuthenticated,
  isPremium,
  viewsController.getRealTimeProducts
);
router.get("/carts/:cid", isAuthenticated, viewsController.getCartDetails);
router.get("/chat", isAuthenticated, viewsController.getChatPage);
router.get("/login", isNotAuthenticated, viewsController.getLoginPage);
router.get("/register", isNotAuthenticated, viewsController.getRegisterPage);
router.get("/profile", isAuthenticated, viewsController.getProfilePage);
router.get("/current", isAuthenticated, viewsController.currentPage);
router.get("/forgot-password", viewsController.getForgotPasswordPage);
router.post("/forgot-password", viewsController.handleForgotPassword);
router.get("/reset-password/:token", viewsController.getResetPasswordPage);
router.post("/reset-password/:token", viewsController.handleResetPassword);

export default router;
