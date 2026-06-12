// // src/routes/adminUserRoutes.js

// import express from "express";

// import {
//   getAllUsers,
//   getUserByIdForAdmin,
//   blockUser,
//   unblockUser,
// } from "../controllers/adminUserController.js";

// import { protect, adminOnly } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// router.get("/", protect, adminOnly, getAllUsers);

// router.get("/:userId", protect, adminOnly, getUserByIdForAdmin);

// router.patch("/:userId/block", protect, adminOnly, blockUser);

// router.patch("/:userId/unblock", protect, adminOnly, unblockUser);

// export default router;


// src/routes/adminUserRoutes.js

import express from "express";

import {
  getAdminUsers,
  toggleUserBlockStatus,
} from "../controllers/adminUserController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAdminUsers);

router.patch(
  "/:userId/toggle-block",
  protect,
  adminOnly,
  toggleUserBlockStatus
);

export default router;