import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/product.model.js';

dotenv.config();

// Your furniture products data
const furnitureProducts = [
  {
    name: 'Modern Lounge Chair',
    description: 'A stylish modern lounge chair designed for comfort and aesthetics. Ideal for homes, studios, and office lounges. Minimal lounge chair for living rooms and reading corners.',
    price: 18500,
    category: 'Furniture',
    subcategory: 'Chairs',
    stock: 12,
    brand: 'Vision Furnish',
    images: [
      'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80',
    ],
    glbModel: 'https://d1q70pf5vjeyhc.cloudfront.net/predictions/0074b3398d814fb7bfd17a35fb7d2f64/1.glb',
    rating: 4.6,
    numReviews: 28,
    isActive: true,
    specifications: {
      width: '78 cm',
      height: '102 cm',
      depth: '74 cm',
      material: 'Wood and Fabric',
      colors: 'Walnut, Beige, Black',
      tags: 'Modern, Minimal, Living Room',
    },
  },
  {
    name: 'Scandinavian Coffee Table',
    description: 'A compact and elegant coffee table perfect for modern interiors and lounge spaces. Elegant wooden coffee table with a clean Scandinavian look.',
    price: 14500,
    category: 'Furniture',
    subcategory: 'Tables',
    stock: 8,
    brand: 'Nordic Nest',
    images: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=900&q=80',
    ],
    glbModel: 'https://d1q70pf5vjeyhc.cloudfront.net/predictions/40df73fd15f74fa7851776e40ec4ce37/1.glb',
    rating: 4.4,
    numReviews: 19,
    isActive: true,
    specifications: {
      width: '110 cm',
      height: '42 cm',
      depth: '58 cm',
      material: 'Solid Wood',
      colors: 'Oak, White',
      tags: 'Coffee Table, Wood, Minimal',
    },
  },
  {
    name: 'Elegant Bedroom Furniture',
    description: 'A beautiful bedroom furniture piece with modern aesthetics, perfect for contemporary homes. Elegant bedroom furniture set with modern design.',
    price: 21000,
    category: 'Furniture',
    subcategory: 'Bedroom',
    stock: 10,
    brand: 'WorkNest',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    ],
    glbModel: 'https://d1q70pf5vjeyhc.cloudfront.net/predictions/0b8e18a8680547099dc875a53d419a0c/1.glb',
    rating: 4.7,
    numReviews: 34,
    isActive: true,
    specifications: {
      width: '120 cm',
      height: '75 cm',
      depth: '60 cm',
      material: 'Engineered Wood',
      colors: 'White, Walnut',
      tags: 'Bedroom, Modern, Elegant',
    },
  },
  {
    name: 'Modern Floor Lamp',
    description: 'This floor lamp adds a clean and premium touch to bedrooms, lounges, and studio spaces. A sleek floor lamp designed for warm ambient room lighting.',
    price: 9200,
    category: 'Furniture',
    subcategory: 'Lighting',
    stock: 14,
    brand: 'Luma Living',
    images: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80',
    ],
    glbModel: 'https://d1q70pf5vjeyhc.cloudfront.net/predictions/6dff692b494e4f43b01f1d0e9ee5e466/1.glb',
    rating: 4.3,
    numReviews: 16,
    isActive: true,
    specifications: {
      width: '28 cm',
      height: '162 cm',
      depth: '28 cm',
      material: 'Metal',
      colors: 'Black, Gold',
      tags: 'Lamp, Lighting, Modern',
    },
  },
  {
    name: 'Modern Two-Seater Sofa',
    description: 'A premium two-seater sofa with soft fabric finish, strong frame, and elegant modern styling. Comfortable two-seater sofa for modern homes and apartments.',
    price: 48000,
    category: 'Furniture',
    subcategory: 'Sofas',
    stock: 6,
    brand: 'Urban Nest',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    ],
    glbModel: 'https://d1q70pf5vjeyhc.cloudfront.net/predictions/f8831904d5124320ba10c0a51286d030/1.glb',
    rating: 4.8,
    numReviews: 41,
    isActive: true,
    specifications: {
      width: '165 cm',
      height: '90 cm',
      depth: '82 cm',
      material: 'Fabric and Foam',
      colors: 'Gray, Navy, Cream',
      tags: 'Sofa, Living Room, Comfort',
    },
  },
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB connected');

    // Delete existing products (optional - remove if you want to keep existing)
    // await Product.deleteMany({});
    // console.log('✓ Existing products deleted');

    // Insert furniture products
    const products = await Product.insertMany(furnitureProducts);
    console.log(`✓ ${products.length} furniture products added successfully!`);

    // Display added products
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding products:', error.message);
    process.exit(1);
  }
};

seedProducts();
