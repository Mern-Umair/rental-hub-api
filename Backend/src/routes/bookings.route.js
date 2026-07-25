import express, { Router } from "express"
import { createBooking, deleteBooking, getBookingById, getBookings, updateBookingStatus } from "../controllers/booking.controllers.js";
import { protect } from "../middleware/auth.middleware.js";


const router = Router();

router.post("/create/bookings", protect, createBooking)
router.get("/get/bookings", protect, getBookings)
router.get("/get/bookings/:id", protect, getBookingById)
router.put("/update/bookings/:id", protect, updateBookingStatus)
router.delete("/delete/bookings/:id", protect, deleteBooking)







export default router;