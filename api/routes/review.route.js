import express from "express";
import { createReview, getReviews, deleteReview } from "../controllers/review.controller.js";
import { verifyToken } from "../middleware/jwt.js";


const router = express.Router();

router.post("/", verifyToken, createReview);
router.get("/:userId", getReviews);
router.delete("/:userId", verifyToken, deleteReview);

export default router;