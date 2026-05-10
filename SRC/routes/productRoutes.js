// import express from "express";
// import {
//   getAllProducts,
//   getProductById,
//   getProductsByCategory,
// } from "../controllers/productController.js";

// const router = express.Router();

// // Public routes - no authentication required
// router.get("/", getAllProducts);
// router.get("/:id", getProductById);
// router.get("/category/:category", getProductsByCategory);

// export default router;




// src/routes/productRoutes.js

import express from "express";

import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
} from "../controllers/productController.js";

const router = express.Router();

// Public routes - no authentication required
router.get("/", getAllProducts);

// Important: category route must come before "/:id"
router.get("/category/:category", getProductsByCategory);

router.get("/:id", getProductById);

export default router;