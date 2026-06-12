// // src/controllers/adminUserController.js

// import User from "../models/user.model.js";

// const getAllUsers = async (req, res) => {
//   try {
//     const { search, status, role } = req.query;

//     const filter = {};

//     if (role && role !== "all") {
//       filter.role = role;
//     }

//     if (status === "blocked") {
//       filter.isBlocked = true;
//     }

//     if (status === "active") {
//       filter.isBlocked = false;
//     }

//     if (search) {
//       filter.$or = [
//         { fullName: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { phoneNumber: { $regex: search, $options: "i" } },
//       ];
//     }

//     const users = await User.find(filter)
//       .select("-password -refreshToken")
//       .sort({ createdAt: -1 });

//     const summary = {
//       totalUsers: users.length,
//       activeUsers: users.filter((user) => !user.isBlocked).length,
//       blockedUsers: users.filter((user) => user.isBlocked).length,
//       adminUsers: users.filter((user) => user.role === "admin").length,
//       normalUsers: users.filter((user) => user.role === "user").length,
//     };

//     return res.status(200).json({
//       success: true,
//       summary,
//       users,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch users.",
//       error: error.message,
//     });
//   }
// };

// const getUserByIdForAdmin = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await User.findById(userId).select("-password -refreshToken");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch user.",
//       error: error.message,
//     });
//   }
// };

// const blockUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (userId === req.user._id.toString()) {
//       return res.status(400).json({
//         success: false,
//         message: "Admin cannot block their own account.",
//       });
//     }

//     const user = await User.findById(userId).select("+refreshToken");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     if (user.role === "admin") {
//       return res.status(400).json({
//         success: false,
//         message: "Admin accounts cannot be blocked from this panel.",
//       });
//     }

//     if (user.isBlocked) {
//       return res.status(400).json({
//         success: false,
//         message: "User is already blocked.",
//       });
//     }

//     user.isBlocked = true;

//     // logout user from refresh-token based session
//     user.refreshToken = undefined;

//     await user.save({ validateBeforeSave: false });

//     return res.status(200).json({
//       success: true,
//       message: "User blocked successfully.",
//       user: {
//         _id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//         role: user.role,
//         isBlocked: user.isBlocked,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to block user.",
//       error: error.message,
//     });
//   }
// };

// const unblockUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await User.findById(userId).select("-password -refreshToken");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     if (!user.isBlocked) {
//       return res.status(400).json({
//         success: false,
//         message: "User is already active.",
//       });
//     }

//     user.isBlocked = false;

//     await user.save({ validateBeforeSave: false });

//     return res.status(200).json({
//       success: true,
//       message: "User unblocked successfully.",
//       user,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to unblock user.",
//       error: error.message,
//     });
//   }
// };

// export {
//   getAllUsers,
//   getUserByIdForAdmin,
//   blockUser,
//   unblockUser,
// };


// src/controllers/adminUserController.js

import User from "../models/user.model.js";
import Order from "../models/order.model.js";

const getAdminUsers = async (req, res) => {
  try {
    const { search = "", role = "all", status = "all" } = req.query;

    const query = {};

    if (role && role !== "all") {
      query.role = role;
    }

    if (status === "active") {
      query.isBlocked = false;
    }

    if (status === "blocked") {
      query.isBlocked = true;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ user: user._id });

        const totalSpent = orders.reduce((sum, order) => {
          return sum + Number(order.total || order.totalAmount || 0);
        }, 0);

        return {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isBlocked: user.isBlocked,
          createdAt: user.createdAt,
          orders: orders.length,
          totalSpent,
        };
      })
    );

    const summary = {
      totalUsers: usersWithStats.length,
      activeUsers: usersWithStats.filter((user) => !user.isBlocked).length,
      blockedUsers: usersWithStats.filter((user) => user.isBlocked).length,
      adminUsers: usersWithStats.filter((user) => user.role === "admin").length,
    };

    return res.status(200).json({
      success: true,
      summary,
      users: usersWithStats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
      error: error.message,
    });
  }
};

const toggleUserBlockStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot block or unblock your own admin account.",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    return res.status(200).json({
      success: true,
      message: user.isBlocked
        ? "User blocked successfully."
        : "User unblocked successfully.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user status.",
      error: error.message,
    });
  }
};

export { getAdminUsers, toggleUserBlockStatus };