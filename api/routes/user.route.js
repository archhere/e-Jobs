import express from "express";
import { deleteUser, getUser, updateProfile } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.delete("/:id", verifyToken, deleteUser);
router.get("/:id", verifyToken, getUser)
router.put("/update", verifyToken, updateProfile)

export default router;