import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  getAllProductsAdmin,
  updateProductStock,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, adminOnly);

router.get("/", getAllProductsAdmin);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/toggle-status", toggleProductStatus);
router.patch("/:id/stock", updateProductStock);

export default router;
