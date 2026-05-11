// src/controllers/adminController.js

import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

const allowedStatuses = [
  "pending",
  "placed",
  "processing",
  "dispatched",
  "delivered",
  "cancelled",
];

const createAdminProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      stock,
      shortDescription,
      description,
      imageUrl,
      images,
      modelUrl,
      arEnabled,
      featured,
      brand,
      specifications,
      rating,
      numReviews,
      material,
      isActive,
      tags,
      colors,
    } = req.body;

    if (!name || !category || !price || !stock || !description) {
      return res.status(400).json({
        success: false,
        message: "Name, category, price, stock, and description are required.",
      });
    }

    // Handle images: accept both 'images' array and 'imageUrl' string
    let productImages = [];
    if (images && Array.isArray(images) && images.length > 0) {
      productImages = images;
    } else if (imageUrl) {
      productImages = [imageUrl];
    }

    const product = await Product.create({
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      shortDescription: shortDescription || "",
      description,
      images: productImages,
      modelUrl: modelUrl || "",
      arEnabled: arEnabled ?? true,
      featured: featured ?? false,
      brand: brand || "",
      specifications: specifications || {},
      rating: rating || 0,
      numReviews: numReviews || 0,
      material: material || "",
      isActive: isActive ?? true,
      tags: tags || [],
      colors: colors || [],
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create product.",
      error: error.message,
    });
  }
};

const allowedDispatchCompanies = [
  {
    name: "TCS Express",
    charges: 350,
  },
  {
    name: "Leopards Courier",
    charges: 300,
  },
  {
    name: "M&P Courier",
    charges: 320,
  },
  {
    name: "Call Courier",
    charges: 280,
  },
];

const getAdminOrders = async (req, res) => {
  try {
    const { status, paymentStatus, search } = req.query;

    const filter = {};

    if (status && status !== "all") {
      filter.orderStatus = status.toLowerCase();
    }

    if (paymentStatus && paymentStatus !== "all") {
      filter.paymentStatus = paymentStatus.toLowerCase();
    }

    let orders = await Order.find(filter)
      .populate("user", "fullName email phoneNumber role")
      .populate("items.product", "name price images stock category")
      .sort({ createdAt: -1 });

    if (search) {
      const searchLower = search.toLowerCase();

      orders = orders.filter((order) => {
        const orderId = order._id.toString().toLowerCase();
        const customerName = order.shippingAddress.fullName.toLowerCase();
        const email = order.shippingAddress.email.toLowerCase();
        const phone = order.shippingAddress.phone.toLowerCase();

        return (
          orderId.includes(searchLower) ||
          customerName.includes(searchLower) ||
          email.includes(searchLower) ||
          phone.includes(searchLower)
        );
      });
    }

    const summary = {
      totalOrders: orders.length,
      pendingOrders: orders.filter((order) => order.orderStatus === "pending")
        .length,
      placedOrders: orders.filter((order) => order.orderStatus === "placed")
        .length,
      processingOrders: orders.filter(
        (order) => order.orderStatus === "processing"
      ).length,
      dispatchedOrders: orders.filter(
        (order) => order.orderStatus === "dispatched"
      ).length,
      deliveredOrders: orders.filter(
        (order) => order.orderStatus === "delivered"
      ).length,
      cancelledOrders: orders.filter(
        (order) => order.orderStatus === "cancelled"
      ).length,
    };

    return res.status(200).json({
      success: true,
      summary,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin orders.",
      error: error.message,
    });
  }
};

const getAdminOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "fullName email phoneNumber role")
      .populate("items.product", "name price images stock category");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order.",
      error: error.message,
    });
  }
};

const updateAdminOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Order status is required.",
      });
    }

    const normalizedStatus = orderStatus.toLowerCase();

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
        allowedStatuses,
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.paymentStatus !== "paid" && normalizedStatus !== "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Only paid orders can be processed or dispatched.",
      });
    }

    order.orderStatus = normalizedStatus;

    if (normalizedStatus === "cancelled") {
      order.paymentStatus =
        order.paymentStatus === "paid" ? order.paymentStatus : "cancelled";
      order.cancelledAt = new Date();
    }

    if (normalizedStatus === "dispatched") {
      if (!order.dispatchCompany) {
        return res.status(400).json({
          success: false,
          message: "Assign a dispatch company before marking as dispatched.",
        });
      }

      order.dispatchedAt = new Date();
    }

    if (normalizedStatus === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update order status.",
      error: error.message,
    });
  }
};

const assignDispatchCompany = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { dispatchCompany } = req.body;

    if (!dispatchCompany) {
      return res.status(400).json({
        success: false,
        message: "Dispatch company is required.",
      });
    }

    const selectedCompany = allowedDispatchCompanies.find(
      (company) =>
        company.name.toLowerCase() === dispatchCompany.toLowerCase()
    );

    if (!selectedCompany) {
      return res.status(400).json({
        success: false,
        message: "Invalid dispatch company.",
        allowedDispatchCompanies,
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Dispatch company can only be assigned to paid orders.",
      });
    }

    if (order.orderStatus === "delivered" || order.orderStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot assign dispatch company to delivered or cancelled order.",
      });
    }

    order.dispatchCompany = selectedCompany.name;
    order.dispatchCharges = selectedCompany.charges;

    if (order.orderStatus === "placed" || order.orderStatus === "pending") {
      order.orderStatus = "processing";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Dispatch company assigned successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to assign dispatch company.",
      error: error.message,
    });
  }
};

const getDispatchCompanies = async (req, res) => {
  return res.status(200).json({
    success: true,
    dispatchCompanies: allowedDispatchCompanies.map((company) => ({
      ...company,
      cityCoverage:
        company.name === "Call Courier" ? "Urban Areas" : "Nationwide",
      deliveryTime:
        company.name === "TCS Express"
          ? "2-4 days"
          : company.name === "Leopards Courier"
          ? "3-5 days"
          : company.name === "M&P Courier"
          ? "2-5 days"
          : "2-3 days",
      rating:
        company.name === "TCS Express"
          ? 4.7
          : company.name === "Leopards Courier"
          ? 4.5
          : company.name === "M&P Courier"
          ? 4.4
          : 4.3,
      status: company.name === "Call Courier" ? "Limited" : "Available",
    })),
  });
};

export {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  assignDispatchCompany,
  getDispatchCompanies,
  createAdminProduct,
};