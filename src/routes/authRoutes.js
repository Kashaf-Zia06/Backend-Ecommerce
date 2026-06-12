import express from "express";

import {
  signup,
  login,
  adminLogin,
  refreshAccessToken,
  logout,
  getMe,
} from "../controllers/authController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User auth
router.post("/signup", signup);
router.post("/login", login);

// Admin auth
router.post("/admin/login", adminLogin);

// Token/auth session
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

// Logged-in user
router.get("/me", protect, getMe);

export default router;