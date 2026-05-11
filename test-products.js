// Quick test script to check products in MongoDB

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testProducts = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Define Product schema
    const productSchema = new mongoose.Schema({}, { strict: false });
    const Product = mongoose.model('Product', productSchema);

    // Count total products
    const totalProducts = await Product.countDocuments();
    console.log(`📦 Total Products in Database: ${totalProducts}\n`);

    // Get first 5 products
    const products = await Product.find().limit(5);
    
    console.log('📋 Sample Products:');
    console.log('==================\n');
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ID: ${product._id}`);
      console.log(`   Price: PKR ${product.price}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Stock: ${product.stock}`);
      console.log(`   Active: ${product.isActive}`);
      console.log(`   Images: ${product.images?.length || 0}`);
      console.log(`   Model URL: ${product.modelUrl || 'Not set'}`);
      console.log(`   AR Enabled: ${product.arEnabled !== undefined ? product.arEnabled : 'Not set'}`);
      console.log('');
    });

    // Check active products
    const activeProducts = await Product.countDocuments({ isActive: true });
    console.log(`✅ Active Products: ${activeProducts}`);
    console.log(`❌ Inactive Products: ${totalProducts - activeProducts}\n`);

    // Check categories
    const categories = await Product.distinct('category');
    console.log(`📂 Categories: ${categories.join(', ')}\n`);

    console.log('✅ Test Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testProducts();
