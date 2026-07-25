import express, { Router } from "express";
import { changePassword, getAllUsers, getProfile, login, logout, signup, updateProfile } from "../controllers/user.controllers.js";
import { protect } from "../middleware/auth.middleware.js";
const router=Router();


router.post("/signup",signup)

router.post("/login",login)
router.get("/get/profile",protect,getProfile)
router.put("/update/profile",protect,updateProfile)
router.put("/update/password",protect,changePassword)
router.get("/get",getAllUsers)
router.post("/logout",logout)










export default router