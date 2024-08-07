import { Router } from 'express';
import { isAuthenticated, isAdmin, isSelfOrAdmin } from '../../middleware/auth.js';
import { getUserByEmail, createUser, getAllUsers, updateUser, deleteUser } from '../../controllers/usersController.js';

const router = Router();

router.get('/:email', isAuthenticated, isAdmin, getUserByEmail);
router.get('/', isAuthenticated, isAdmin, getAllUsers);
router.post('/', createUser);
router.put('/:uid', isAuthenticated, isSelfOrAdmin, updateUser);
router.delete('/:uid', isAuthenticated, isAdmin, deleteUser);

export default router;
