import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
} from "../controllers/productController.js";

const router = express.Router();

// Public routes - no authentication required
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/category/:category", getProductsByCategory);

export default router;
