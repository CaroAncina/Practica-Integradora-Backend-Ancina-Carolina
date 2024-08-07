import { Router } from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../../controllers/productsController.js';
import { isAdmin, isAuthenticated } from '../../middleware/auth.js';

const router = Router();

router.get("/", getAllProducts);
router.get('/:pid', getProductById);
router.post('/', isAuthenticated, isAdmin, createProduct); 
router.put('/:pid', isAuthenticated, isAdmin, updateProduct); 
router.delete('/:pid', isAuthenticated, isAdmin, deleteProduct); 

export default router;
