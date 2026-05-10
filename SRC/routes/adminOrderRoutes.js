// src/routes/adminOrderRoutes.js

import express from "express";

import {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  assignDispatchCompany,
  getDispatchCompanies,
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAdminOrders);

router.get("/dispatch-companies", protect, adminOnly, getDispatchCompanies);

router.get("/:orderId", protect, adminOnly, getAdminOrderById);

router.patch("/:orderId/status", protect, adminOnly, updateAdminOrderStatus);

router.patch(
  "/:orderId/dispatch-company",
  protect,
  adminOnly,
  assignDispatchCompany
);

export default router;