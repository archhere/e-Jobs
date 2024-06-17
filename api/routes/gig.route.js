import express from "express";
import { 
    createGig,
    deleteGig,
    getGig,
    getGigs,
    updateGig,
    intent,
    confirm
} from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createGig);
router.delete("/:id", verifyToken, deleteGig);
router.get("/single/:id", getGig);
router.get("/", getGigs);
router.put("/:id", verifyToken, updateGig);
router.put("/create-payment-intent/:id", verifyToken, intent);
router.put("/", verifyToken, confirm);

export default router;