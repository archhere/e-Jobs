import express from "express";
import { register, login, logout, updateProfile } from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/register", register);
router.put("/update/:id", updateProfile)
router.post("/login", login);
router.post("/logout", logout);

export default router;