import express from "express";
import {
  saveARepo,
  getFavRepo,
  deleteRepo,
} from "../Controllers/repoController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

// Do I need the middleware in this route???

const router = express.Router();

//Save a new repo
router.post("/favorites", authMiddleware, saveARepo);
//Get user's favorite repos
router.get("/favorites", authMiddleware, getFavRepo);
// Delete user's repo
router.delete("/favorites/:id", authMiddleware, deleteRepo);
export default router;
