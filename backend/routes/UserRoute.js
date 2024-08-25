import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/Users.js";
import { VerifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/users", VerifyUser, adminOnly, getUsers);
router.get("/users/:id", VerifyUser, adminOnly, getUserById);
router.post("/users", VerifyUser, adminOnly, createUser);
router.patch("/users/:id", VerifyUser, adminOnly, updateUser);
router.delete("/users/:id", VerifyUser, adminOnly, deleteUser);

export default router;
