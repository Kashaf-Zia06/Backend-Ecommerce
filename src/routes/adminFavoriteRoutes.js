import express from "express";
import {
  getAllFavorites,
  getFavoriteStats,
  deleteFavoriteById,
} from "../controllers/favoriteController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, adminOnly);

router.get("/", getAllFavorites);
router.get("/stats", getFavoriteStats);
router.delete("/:id", deleteFavoriteById);

export default router;
