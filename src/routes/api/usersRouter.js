import { Router } from "express";
import { isAuthenticated, isAdmin } from "../../middleware/auth.js";
import {
  getUserByEmail,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  changeUserRole,
  updateUserDocuments,
  uploadProfileImage,
  deleteInactiveUsers,
} from "../../controllers/usersController.js";
import upload from "../../middleware/multer.js";

const router = Router();

router.get("/:email", isAuthenticated, getUserByEmail);
router.post("/", createUser);
router.put("/", isAuthenticated, updateUser);
router.delete("/", isAuthenticated, deleteUser);
router.post("/premium/", isAuthenticated, changeUserRole);
router.post(
  "/upload/profiles/",
  isAuthenticated,
  upload.single("profile"),
  uploadProfileImage
);
router.post(
  "/documents",
  isAuthenticated,
  upload.array("documents", 5),
  updateUserDocuments
);
router.post("/inactive", isAdmin, deleteInactiveUsers);

router.get("/", isAuthenticated, isAdmin, getAllUsers);
router.post("/:uid/role", changeUserRole);
router.delete("/:uid", deleteUser);

export default router;
