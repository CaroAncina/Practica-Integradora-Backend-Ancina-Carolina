import { Router } from "express";
import {
  isAuthenticated,
  isUserOrPremium,
  isAdmin,
} from "../../middleware/auth.js";
import {
  getCarts,
  getCartById,
  addProductToCart,
  updateProductQuantity,
  clearCart,
  removeProductFromCart,
  purchaseCart,
} from "../../controllers/cartsController.js";

const router = Router();

router.get("/", isAuthenticated, isUserOrPremium, isAdmin, getCarts);
router.get("/:cid", isAuthenticated, isUserOrPremium, getCartById);
router.post(
  "/product/:pid",
  isAuthenticated,
  isUserOrPremium,
  addProductToCart
);
router.put(
  "/product/:pid",
  isAuthenticated,
  isUserOrPremium,
  updateProductQuantity
);
router.delete(
  "/product/:pid",
  isAuthenticated,
  isUserOrPremium,
  removeProductFromCart
);
router.delete("/", isAuthenticated, isUserOrPremium, clearCart);
router.post("/purchase", isAuthenticated, isUserOrPremium, purchaseCart);

export default router;
