import express from "express";
import { createNewUser, logInUser } from "../Controllers/authController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();
// Create new user
router.post("/register", authMiddleware, createNewUser);
// Log in user
router.post("/logIn", authMiddleware, logInUser);

export default router;
