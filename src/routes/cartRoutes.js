// src/routes/cartRoutes.js

import express from "express";
import {
  getCart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);

router.post("/add", protect, addToCart);

router.patch("/increase/:productId", protect, increaseQuantity);

router.patch("/decrease/:productId", protect, decreaseQuantity);

router.delete("/remove/:productId", protect, removeFromCart);

router.delete("/clear", protect, clearCart);

export default router;