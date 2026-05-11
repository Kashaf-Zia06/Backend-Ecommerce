// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";

// const protect = async (req, res, next) => {
//   try {
//     console.log("inside auth middleare.js")
//     let token;

//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }
//     console.log("requts inside auth",req)
//     console.log(token)
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized. No access token provided.",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     const user = await User.findById(decoded.id).select(
//       "-password -refreshToken"
//     );

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User no longer exists.",
//       });
//     }

//     if (user.isBlocked) {
//       return res.status(403).json({
//         success: false,
//         message: "Your account has been blocked.",
//       });
//     }

//     req.user = user;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Access token expired or invalid.",
//     });
//   }
// };

// const adminOnly = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     return next();
//   }

//   return res.status(403).json({
//     success: false,
//     message: "Access denied. Admin only.",
//   });
// };

// export { protect, adminOnly };



// src/middlewares/authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No access token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Special case for admin stored only in .env
    if (decoded.id === "env-admin" && decoded.role === "admin") {
      const envAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

      if (!envAdminEmail || decoded.email !== envAdminEmail) {
        return res.status(401).json({
          success: false,
          message: "Invalid admin token.",
        });
      }

      req.user = {
        _id: "env-admin",
        id: "env-admin",
        fullName: process.env.ADMIN_NAME || "Admin",
        email: envAdminEmail,
        role: "admin",
        isBlocked: false,
      };

      return next();
    }

    // Normal MongoDB user flow
    const user = await User.findById(decoded.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Access token expired or invalid.",
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Admin only.",
  });
};

export { protect, adminOnly };