import express, { Router } from "express"
import { protect } from "../middleware/auth.middleware.js";
import { createPayment, getAllPayments, getPaymentById, updatePaymentStatus } from "../controllers/payment.contollers.js";

const router = Router();

router.post("/create", protect, createPayment)
router.get("/get", protect, getAllPayments)
router.get("/get/:id", protect, getPaymentById)
router.patch("/status/:id", protect, updatePaymentStatus)

export default router;  