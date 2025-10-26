// Routes/userRoutes.ts
import { Router } from "express";
import {
  getFavorites,
  addFavorite,
  deleteFavorite,
} from "../Controllers/repoController";
import { authMiddleware } from "../Middleware/authMiddleware";

const router = Router();

router.use(authMiddleware); // protect all routes below

// Get all fav repo
router.get("/favorites", getFavorites);
// Add fav repo
router.post("/favorites", addFavorite);
//Delete fav repo
router.delete("/favorites/:id", deleteFavorite);

export default router;
