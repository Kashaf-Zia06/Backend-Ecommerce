import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to admin dashboard",
    admin: req.user,
  });
});

export default router;