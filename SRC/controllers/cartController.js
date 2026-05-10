// src/controllers/cartController.js

import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const calculateCartSummary = (cart) => {
  const subtotal = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  return {
    subtotal,
    tax,
    shipping: 0,
    total,
  };
};

const formatCartResponse = (cart) => {
  return {
    _id: cart._id,
    user: cart.user,
    items: cart.items,
    summary: calculateCartSummary(cart),
  };
};

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    return res.status(200).json({
      success: true,
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart.",
      error: error.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    console.log("inside add to cart of cart contoller at backend")
    console.log(req.body)
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock.",
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock.`,
        });
      }

      existingItem.quantity += 1;

      // keep latest product data in cart
      existingItem.name = product.name;
      existingItem.price = product.price;
      existingItem.imageUrl = product.images?.[0] || "";
      existingItem.stock = product.stock;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.images?.[0] || "",
        quantity: 1,
        stock: product.stock,
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart.",
    cart: formatCartResponse(cart),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart.",
      error: error.message,
    });
  }
};

const increaseQuantity = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart.",
      });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product no longer exists.",
      });
    }

    if (item.quantity >= product.stock) {
      return res.status(400).json({
        success: false,
        message: `Maximum stock limit reached. Only ${product.stock} available.`,
      });
    }

    item.quantity += 1;

    // update latest stock also
    item.stock = product.stock;
    item.price = product.price;
    item.name = product.name;
    item.imageUrl = product.images?.[0] || "";

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Quantity increased.",
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to increase quantity.",
      error: error.message,
    });
  }
};

const decreaseQuantity = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart.",
      });
    }

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Quantity decreased.",
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to decrease quantity.",
      error: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart.",
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove product from cart.",
      error: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared.",
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to clear cart.",
      error: error.message,
    });
  }
};

export {
  getCart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
};