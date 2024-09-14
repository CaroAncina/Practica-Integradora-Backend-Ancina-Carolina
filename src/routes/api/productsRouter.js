import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/productsController.js";
import { isAuthenticated, isAdminOrPremium } from "../../middleware/auth.js";

const router = Router();

router.get("/", isAuthenticated, getAllProducts);
router.get("/:pid", isAuthenticated, getProductById);
router.post("/", isAuthenticated, isAdminOrPremium, createProduct);
router.put("/:pid", isAuthenticated, isAdminOrPremium, updateProduct);
router.delete("/:pid", isAuthenticated, isAdminOrPremium, deleteProduct);

export default router;
