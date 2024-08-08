import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.js";
import {
  getUserByEmail,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../../controllers/usersController.js";

const router = Router();

router.get("/:email", isAuthenticated, getUserByEmail);
router.get("/", isAuthenticated, getAllUsers);
router.post("/", createUser);
router.put("/:uid", isAuthenticated, updateUser);
router.delete("/:uid", isAuthenticated, deleteUser);

export default router;
