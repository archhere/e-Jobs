import express from "express";
import { deleteUser } from "../controllers/conversation.controller.js";


const router = express.Router();

router.get("/test", deleteUser);

export default router;