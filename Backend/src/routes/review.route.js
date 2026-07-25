import { Router } from "express"
import { protect } from "../middleware/auth.middleware.js";
import { createReview, deleteReview, getReviews } from "../controllers/review.controllers.js";

const router = Router();

router.post("/create", protect, createReview)
router.get("/get/:property_id", getReviews)
router.delete("/delete/:id", protect, deleteReview)

export default router;