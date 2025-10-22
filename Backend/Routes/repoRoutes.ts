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

router.get("/favorites", getFavorites);
router.post("/favorites", addFavorite);
router.delete("/favorites/:id", deleteFavorite);

export default router;
