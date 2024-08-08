import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/productsController.js";
import { isAuthenticated, isPremium } from "../../middleware/auth.js";

const router = Router();

router.get("/", isAuthenticated, getAllProducts);
router.get("/:pid", isAuthenticated, getProductById);
router.post("/", isAuthenticated, isPremium, createProduct);
router.put("/:pid", isAuthenticated, isPremium, updateProduct);
router.delete("/:pid", isAuthenticated, isPremium, deleteProduct);

export default router;
