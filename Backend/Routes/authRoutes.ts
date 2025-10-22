import { Router } from "express";
import { register, login } from "../Controllers/authController";

const router = Router();
// Create new user
router.post("/register", register);
// Log in user
router.post("/login", login);

export default router;
