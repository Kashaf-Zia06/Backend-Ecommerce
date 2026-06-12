import express from "express";

import {
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  getAllProductsAdmin,
  updateProductStock,
} from "../controllers/productController.js";

import { createAdminProduct } from "../controllers/adminController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, adminOnly);

router.get("/", getAllProductsAdmin);

// Add product by admin
router.post("/add", createAdminProduct);

router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/toggle-status", toggleProductStatus);
router.patch("/:id/stock", updateProductStock);

export default router;