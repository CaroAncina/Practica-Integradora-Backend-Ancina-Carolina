import { Router } from "express";
import { isAuthenticated, isUser } from "../../middleware/auth.js";
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

router.get("/", isAuthenticated, isUser, getCarts);
router.get("/:cid", isAuthenticated, isUser, getCartById);
router.post("/product/:pid", isAuthenticated, isUser, addProductToCart);
router.put(
  "/:cid/products/:pid",
  isAuthenticated,
  isUser,
  updateProductQuantity
);
router.delete("/:cid", isAuthenticated, isUser, clearCart);
router.delete(
  "/:cid/products/:pid",
  isAuthenticated,
  isUser,
  removeProductFromCart
);
router.post("/:cid/purchase", isAuthenticated, isUser, purchaseCart);

export default router;
