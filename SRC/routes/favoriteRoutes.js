import express from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkFavoriteStatus,
  clearAllFavorites,
} from "../controllers/favoriteController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get("/", getUserFavorites);
router.post("/", addToFavorites);
router.delete("/clear", clearAllFavorites);
router.get("/check/:productId", checkFavoriteStatus);
router.delete("/:productId", removeFromFavorites);

export default router;
