import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImageProduct,
} from "../../controllers/productsController.js";
import { isAuthenticated, isAdminOrPremium } from "../../middleware/auth.js";
import upload from "../../middleware/multer.js"; // Importa multer correctamente

const router = Router();

router.get("/", isAuthenticated, getAllProducts);
router.get("/:pid", isAuthenticated, getProductById);
router.post(
  "/",
  isAuthenticated,
  isAdminOrPremium,
  upload.single("product"),
  createProduct
);
router.put(
  "/:pid",
  isAuthenticated,
  isAdminOrPremium,
  upload.single("product"),
  updateProduct
);
router.delete("/:pid", isAuthenticated, isAdminOrPremium, deleteProduct);
router.post(
  "/:pid/image",
  isAuthenticated,
  isAdminOrPremium,
  upload.single("product"),
  uploadImageProduct
);

export default router;
