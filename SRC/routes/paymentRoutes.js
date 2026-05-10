// src/routes/paymentRoutes.js

import express from "express";

import {
  createSimulationOrder,
  confirmSimulationPayment,
  cancelSimulationOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/paymentController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/simulation/create-order", protect, createSimulationOrder);

router.patch(
  "/simulation/confirm/:orderId",
  protect,
  confirmSimulationPayment
);

router.patch(
  "/simulation/cancel/:orderId",
  protect,
  cancelSimulationOrder
);

router.get("/orders", protect, getMyOrders);

router.get("/orders/:orderId", protect, getOrderById);

export default router;