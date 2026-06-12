// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Product name is required"],
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: [true, "Product description is required"],
//       trim: true,
//     },
//     price: {
//       type: Number,
//       required: [true, "Product price is required"],
//       min: [0, "Price cannot be negative"],
//     },
//     category: {
//       type: String,
//       required: [true, "Product category is required"],
//       trim: true,
//     },
//     stock: {
//       type: Number,
//       required: [true, "Product stock is required"],
//       min: [0, "Stock cannot be negative"],
//       default: 0,
//     },
//     images: {
//       type: [String],
//       default: [],
//     },
//     rating: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 5,
//     },
//     numReviews: {
//       type: Number,
//       default: 0,
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     brand: {
//       type: String,
//       trim: true,
//     },
//     specifications: {
//       type: Map,
//       of: String,
//       default: {},
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Index for search optimization
// productSchema.index({ name: "text", description: "text", category: "text" });

// const Product = mongoose.model("Product", productSchema);

// export default Product;



import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },

    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },

    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    modelUrl: {
      type: String,
      default: "",
    },

    arEnabled: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    brand: {
      type: String,
      trim: true,
      default: "",
    },

    specifications: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: "text", description: "text", category: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;