import express, { Router } from "express";
import { deleteProperty, getAllProperties, getPropertyById, properties, updateProperty } from "../controllers/property.controllers.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add",protect, properties)
router.get("/get",protect, getAllProperties)
router.get("/get/:id",protect, getPropertyById)

router.put("/update/:id",protect, updateProperty)
router.delete("/delete/:id",protect, deleteProperty)






export default router;