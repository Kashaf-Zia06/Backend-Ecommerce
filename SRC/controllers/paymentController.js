// src/controllers/paymentController.js

import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

const calculateSummary = (items) => {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const tax = Math.round(subtotal * 0.18);
  const shippingFee = 0;
  const total = subtotal + tax + shippingFee;

  return {
    subtotal,
    tax,
    shippingFee,
    total,
  };
};

const createSimulationOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required.",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty.",
      });
    }

    const checkedItems = [];

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product);

      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `${cartItem.name} is no longer available.`,
        });
      }

      if (cartItem.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available for ${product.name}.`,
        });
      }

      checkedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.images?.[0] || "",
        quantity: cartItem.quantity,
      });
    }

    const summary = calculateSummary(checkedItems);

    const order = await Order.create({
      user: req.user._id,
      items: checkedItems,
      shippingAddress,
      subtotal: summary.subtotal,
      tax: summary.tax,
      shippingFee: summary.shippingFee,
      total: summary.total,
      paymentMethod: "simulation",
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Simulation order created. Payment is pending.",
      order,
      paymentTestCards: {
        success: "4242424242424242",
        declined: "4000000000009995",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create simulation order.",
      error: error.message,
    });
  }
};

const confirmSimulationPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { cardNumber } = req.body;

    if (!cardNumber) {
      return res.status(400).json({
        success: false,
        message: "Card number is required for simulation.",
      });
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, "");

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid.",
      });
    }

    if (order.paymentStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled order cannot be paid.",
      });
    }

    if (cleanCardNumber === "4000000000009995") {
      order.paymentStatus = "failed";
      order.orderStatus = "pending";
      order.simulationTransactionId = "sim_failed_" + Date.now();

      await order.save();

      return res.status(400).json({
        success: false,
        message: "Payment declined in simulation.",
        order,
      });
    }

    if (cleanCardNumber !== "4242424242424242") {
      return res.status(400).json({
        success: false,
        message:
          "Invalid simulation card. Use 4242424242424242 for success or 4000000000009995 for decline.",
      });
    }

    for (const item of order.items) {
      const product = await Product.findById(item.product);

      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `${item.name} is no longer available.`,
        });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available for ${product.name}.`,
        });
      }
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } }
    );

    order.paymentStatus = "paid";
    order.orderStatus = "placed";
    order.simulationTransactionId = "sim_paid_" + Date.now();
    order.paidAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Simulation payment successful. Order placed.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to confirm simulation payment.",
      error: error.message,
    });
  }
};

const cancelSimulationOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Paid order cannot be cancelled from payment page.",
      });
    }

    order.paymentStatus = "cancelled";
    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Simulation order cancelled.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to cancel simulation order.",
      error: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name price images stock category");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    }).populate("items.product", "name price images stock category");

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

export {
  createSimulationOrder,
  confirmSimulationPayment,
  cancelSimulationOrder,
  getMyOrders,
  getOrderById,
};