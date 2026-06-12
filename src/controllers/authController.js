import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import {
  validateSignupInput,
  validateLoginInput,
} from "../utils/authValidations.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const sendAuthResponse = async (res, user, message, statusCode = 200) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    accessToken,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
};

// const signup = async (req, res) => {
//   try {
//     console.log("inside signup at backend auth controller")
//     console.log(req.body)
//     const { fullName, email, password, phoneNumber } = req.body || {};

//     const validationErrors = validateSignupInput({
//       fullName,
//       email,
//       password,
//       phoneNumber,
//     });

//     if (validationErrors.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: validationErrors[0],
//         errors: validationErrors,
//       });
//     }

//     const existingUser = await User.findOne({
//       email: email.trim().toLowerCase(),
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "An account with this email already exists.",
//       });
//     }

//     const user = await User.create({
//       fullName: fullName.trim(),
//       email: email.trim().toLowerCase(),
//       phoneNumber: phoneNumber.trim(),
//       password,
//       role: "user",
//     });

//     return sendAuthResponse(res, user, "Signup successful.", 201);
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Signup failed.",
//       error: error.message,
//     });
//   }
// };


const signup = async (req, res) => {
  try {
    console.log("inside signup at backend auth controller");
    console.log(req.body);

    const { fullName, email, password, phoneNumber } = req.body || {};

    const validationErrors = validateSignupInput({
      fullName,
      email,
      password,
      phoneNumber,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors[0],
        errors: validationErrors,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (adminEmail && normalizedEmail === adminEmail) {
      return res.status(400).json({
        success: false,
        message: "This email is reserved for admin. Please use another email.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phoneNumber: phoneNumber.trim(),
      password,
      role: "user",
    });

    return sendAuthResponse(res, user, "Signup successful.", 201);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Signup failed.",
      error: error.message,
    });
  }
};


const login = async (req, res) => {
  try {
    console.log("isnide login of controller at backend")
    console.log(req.body)
    const { email, password } = req.body || {};

    const validationErrors = validateLoginInput({
      email,
      password,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors[0],
        errors: validationErrors,
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password +refreshToken");

    if (!user || user.role !== "user") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return sendAuthResponse(res, user, "Login successful.");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed.",
      error: error.message,
    });
  }
};




const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const validationErrors = validateLoginInput({
      email,
      password,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors[0],
        errors: validationErrors,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const envAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD;

    if (!envAdminEmail || !envAdminPassword) {
      return res.status(500).json({
        success: false,
        message: "Admin credentials are not configured on the server.",
      });
    }

    if (normalizedEmail !== envAdminEmail || password !== envAdminPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const accessToken = jwt.sign(
      {
        id: "env-admin",
        role: "admin",
        email: envAdminEmail,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      accessToken,
      user: {
        _id: "env-admin",
        fullName: process.env.ADMIN_NAME || "Admin",
        email: envAdminEmail,
        role: "admin",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin login failed.",
      error: error.message,
    });
  }
};








const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token found.",
      });
    }

    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token.",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    const newAccessToken = generateAccessToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully.",
      accessToken: newAccessToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Refresh token expired or invalid.",
    });
  }
};

const logout = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (incomingRefreshToken) {
      const user = await User.findOne({
        refreshToken: incomingRefreshToken,
      }).select("+refreshToken");

      if (user) {
        user.refreshToken = undefined;
        await user.save({ validateBeforeSave: false });
      }
    }

    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed.",
      error: error.message,
    });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

export {
  signup,
  login,
  adminLogin,
  refreshAccessToken,
  logout,
  getMe,
};