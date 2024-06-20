import express from "express";
import { getConversations, createConversation, getSingleConversation, updateConversation } from "../controllers/conversation.controller.js";
import { verifyToken } from "../middleware/jwt.js";


const router = express.Router();

router.get("/", verifyToken, getConversations);
router.post("/", verifyToken, createConversation);
router.get("/single/:user1/:user2", verifyToken, getSingleConversation);
router.put("/:id", verifyToken, updateConversation);

export default router;