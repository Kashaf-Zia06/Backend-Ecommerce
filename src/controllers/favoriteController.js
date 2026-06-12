import Favorite from "../models/favorite.model.js";
import Product from "../models/product.model.js";

// ==================== USER APIS ====================

// Add product to favorites
const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      user: userId,
      product: productId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Product already in favorites",
      });
    }

    const favorite = await Favorite.create({
      user: userId,
      product: productId,
    });

    return res.status(201).json({
      success: true,
      message: "Product added to favorites",
      data: favorite,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add product to favorites",
      error: error.message,
    });
  }
};

// Remove product from favorites
const removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      product: productId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from favorites",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove product from favorites",
      error: error.message,
    });
  }
};

// Get user's favorite products
const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const favorites = await Favorite.find({ user: userId })
      .populate("product")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Favorite.countDocuments({ user: userId });

    return res.status(200).json({
      success: true,
      message: "Favorites fetched successfully",
      data: {
        favorites,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalFavorites: total,
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch favorites",
      error: error.message,
    });
  }
};

// Check if product is in user's favorites
const checkFavoriteStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const favorite = await Favorite.findOne({
      user: userId,
      product: productId,
    });

    return res.status(200).json({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to check favorite status",
      error: error.message,
    });
  }
};

// Clear all favorites for a user
const clearAllFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Favorite.deleteMany({ user: userId });

    return res.status(200).json({
      success: true,
      message: "All favorites cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to clear favorites",
      error: error.message,
    });
  }
};

// ==================== ADMIN APIS ====================

// Get all favorites (Admin only)
const getAllFavorites = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, productId } = req.query;

    const query = {};

    if (userId) {
      query.user = userId;
    }

    if (productId) {
      query.product = productId;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const favorites = await Favorite.find(query)
      .populate("user", "fullName email")
      .populate("product", "name price category")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Favorite.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "All favorites fetched successfully",
      data: {
        favorites,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalFavorites: total,
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch favorites",
      error: error.message,
    });
  }
};

// Get favorite statistics (Admin only)
const getFavoriteStats = async (req, res) => {
  try {
    // Total favorites
    const totalFavorites = await Favorite.countDocuments();

    // Most favorited products
    const mostFavorited = await Favorite.aggregate([
      {
        $group: {
          _id: "$product",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $project: {
          _id: 1,
          count: 1,
          name: "$productDetails.name",
          price: "$productDetails.price",
          category: "$productDetails.category",
        },
      },
    ]);

    // Users with most favorites
    const topUsers = await Favorite.aggregate([
      {
        $group: {
          _id: "$user",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 1,
          count: 1,
          fullName: "$userDetails.fullName",
          email: "$userDetails.email",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Favorite statistics fetched successfully",
      data: {
        totalFavorites,
        mostFavoritedProducts: mostFavorited,
        topUsers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch favorite statistics",
      error: error.message,
    });
  }
};

// Delete favorite by ID (Admin only)
const deleteFavoriteById = async (req, res) => {
  try {
    const { id } = req.params;

    const favorite = await Favorite.findByIdAndDelete(id);

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Favorite deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete favorite",
      error: error.message,
    });
  }
};

export {
  // User APIs
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkFavoriteStatus,
  clearAllFavorites,
  
  // Admin APIs
  getAllFavorites,
  getFavoriteStats,
  deleteFavoriteById,
};
