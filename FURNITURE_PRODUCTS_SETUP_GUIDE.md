# 🛋️ Complete Guide: Add Real Furniture Products with Cloudinary

## 📋 **Overview**

This guide will help you:
1. ✅ Setup Cloudinary for 3D model storage
2. ✅ Upload GLB files to Cloudinary
3. ✅ Delete dummy test products from MongoDB
4. ✅ Add real furniture products to MongoDB
5. ✅ Test APIs with real data

---

# ☁️ **Phase 1: Setup Cloudinary**

## **Step 1: Create Cloudinary Account**

1. Go to: https://cloudinary.com/users/register_free
2. Fill in:
   - Email
   - Password
   - Choose "Developer" as role
3. Click "Create Account"
4. Verify your email
5. Login to dashboard

---

## **Step 2: Get Cloudinary Credentials**

After login, you'll see your **Dashboard**. Copy these values:

```
Cloud Name: dxxxxx (example: dab12cd3e)
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz
```

**Where to find:**
- Top of dashboard page
- Or go to: Settings → Account → Cloud name, API Key, API Secret

---

## **Step 3: Update .env File**

Open `backend/.env` and replace the Cloudinary values:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dab12cd3e  ← Replace with your cloud name
CLOUDINARY_API_KEY=123456789012345  ← Replace with your API key
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz  ← Replace with your API secret
```

---

# 📤 **Phase 2: Upload GLB Files to Cloudinary**

## **Method 1: Upload via Cloudinary Dashboard (Easy)**

### **Step 1: Go to Media Library**

1. Login to Cloudinary
2. Click **"Media Library"** (left sidebar)
3. Click **"Upload"** button (top right)

---

### **Step 2: Create Folder for 3D Models**

1. Click **"Create Folder"**
2. Name it: `furniture-models` or `ar-products`
3. Open the folder

---

### **Step 3: Upload GLB Files**

1. Click **"Upload"** button
2. Select your GLB files (3D models)
3. Wait for upload to complete
4. You'll see all your uploaded files

---

### **Step 4: Get File URLs**

For each uploaded file:
1. Click on the file
2. Copy the **"Secure URL"**
3. Example URL:
   ```
   https://res.cloudinary.com/dab12cd3e/raw/upload/v1234567890/furniture-models/sofa.glb
   ```

4. Save these URLs - you'll use them in product data!

---

## **Method 2: Upload via Code (Advanced)**

### **Step 1: Install Cloudinary Package**

```bash
cd backend
npm install cloudinary
```

### **Step 2: Create Upload Script**

Create file: `backend/SRC/utils/uploadToCloudinary.js`

```javascript
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload GLB file
const uploadGLB = async (filePath, fileName) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'furniture-models',
      resource_type: 'raw', // Important for GLB files
      public_id: fileName,
    });
    
    console.log('Upload successful!');
    console.log('URL:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

// Example usage
uploadGLB('./path/to/your/sofa.glb', 'modern-sofa');
```

---

# 🗑️ **Phase 3: Delete Dummy Test Products**

## **Option 1: Delete via MongoDB Compass**

1. Open MongoDB Compass
2. Connect to your database
3. Go to `AR-Ecommerce` → `products` collection
4. Select all test products (iPhone, Samsung, etc.)
5. Click **Delete** button
6. Confirm deletion

---

## **Option 2: Delete via Postman**

For each test product:

```
Method: DELETE
URL: http://localhost:5000/api/admin/products/PRODUCT_ID

Authorization: Bearer (admin token)
```

Repeat for all dummy products.

---

## **Option 3: Delete All Products at Once**

In MongoDB Compass:
1. Go to `products` collection
2. Click **"Documents"** tab
3. Click the **trash icon** next to "Filter"
4. Type: `{}` (empty filter = all documents)
5. Click **"Delete All"**
6. Confirm

---

# 🛋️ **Phase 4: Add Real Furniture Products**

## **Product Data Structure**

Each furniture product should have:

```javascript
{
  name: "Modern Sofa",
  description: "Comfortable 3-seater sofa with premium fabric",
  price: 899,
  category: "Furniture",
  stock: 15,
  brand: "IKEA",
  images: [
    "https://res.cloudinary.com/.../sofa-front.jpg",
    "https://res.cloudinary.com/.../sofa-side.jpg"
  ],
  glbModel: "https://res.cloudinary.com/.../sofa.glb",  // 3D model URL
  specifications: {
    dimensions: "200cm x 90cm x 85cm",
    material: "Fabric",
    color: "Gray",
    weight: "45kg",
    seatingCapacity: "3 persons"
  }
}
```

---

## **Sample Furniture Products**

### **Product 1: Modern Sofa**

```json
{
  "name": "Modern 3-Seater Sofa",
  "description": "Elegant and comfortable sofa perfect for living rooms. Features premium fabric upholstery and solid wood frame.",
  "price": 899,
  "category": "Furniture",
  "subcategory": "Living Room",
  "stock": 15,
  "brand": "IKEA",
  "images": [
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/furniture/sofa-front.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/furniture/sofa-side.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/furniture/sofa-angle.jpg"
  ],
  "glbModel": "https://res.cloudinary.com/YOUR_CLOUD/raw/upload/v1/furniture-models/sofa.glb",
  "specifications": {
    "dimensions": "200cm x 90cm x 85cm",
    "material": "Premium Fabric",
    "color": "Charcoal Gray",
    "weight": "45kg",
    "seatingCapacity": "3 persons",
    "frameType": "Solid Wood"
  }
}
```

---

### **Product 2: Dining Table**

```json
{
  "name": "Wooden Dining Table",
  "description": "Spacious 6-seater dining table made from solid oak wood. Perfect for family gatherings.",
  "price": 1299,
  "category": "Furniture",
  "subcategory": "Dining Room",
  "stock": 8,
  "brand": "West Elm",
  "images": [
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/furniture/table-top.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/furniture/table-side.jpg"
  ],
  "glbModel": "https://res.cloudinary.com/YOUR_CLOUD/raw/upload/v1/furniture-models/dining-table.glb",
  "specifications": {
    "dimensions": "180cm x 90cm x 75cm",
    "material": "Solid Oak Wood",
    "color": "Natural Wood",
    "weight": "65kg",
    "seatingCapacity": "6 persons",
    "finish": "Matte Lacquer"
  }
}
```

---

### **Product 3: Office Chair**

```json
{
  "name": "Ergonomic Office Chair",
  "description": "Comfortable office chair with lumbar support and adjustable height. Perfect for long working hours.",
  "price": 349,
  "category": "Furniture",
  "subcategory": "Office",
  "stock": 25,
  "brand": "Herman Miller",
  "images": [
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/furniture/chair-front.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/furniture/chair-side.jpg"
  ],
  "glbModel": "https://res.cloudinary.com/YOUR_CLOUD/raw/upload/v1/furniture-models/office-chair.glb",
  "specifications": {
    "dimensions": "65cm x 65cm x 120cm",
    "material": "Mesh & Plastic",
    "color": "Black",
    "weight": "15kg",
    "maxWeight": "120kg",
    "features": "Adjustable Height, Lumbar Support, 360° Swivel"
  }
}
```

---

### **Product 4: Bookshelf**

```json
{
  "name": "5-Tier Wooden Bookshelf",
  "description": "Spacious bookshelf with 5 tiers. Perfect for organizing books, decorative items, and plants.",
  "price": 449,
  "category": "Furniture",
  "subcategory": "Storage",
  "stock": 12,
  "brand": "Crate & Barrel",
  "images": [
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/furniture/bookshelf-front.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/furniture/bookshelf-detail.jpg"
  ],
  "glbModel": "https://res.cloudinary.com/YOUR_CLOUD/raw/upload/v1/furniture-models/bookshelf.glb",
  "specifications": {
    "dimensions": "80cm x 30cm x 180cm",
    "material": "Engineered Wood",
    "color": "Walnut Brown",
    "weight": "25kg",
    "shelves": "5 tiers",
    "maxLoadPerShelf": "15kg"
  }
}
```

---

### **Product 5: Bed Frame**

```json
{
  "name": "Queen Size Bed Frame",
  "description": "Modern platform bed frame with upholstered headboard. No box spring required.",
  "price": 799,
  "category": "Furniture",
  "subcategory": "Bedroom",
  "stock": 10,
  "brand": "Pottery Barn",
  "images": [
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/furniture/bed-front.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/furniture/bed-angle.jpg"
  ],
  "glbModel": "https://res.cloudinary.com/YOUR_CLOUD/raw/upload/v1/furniture-models/bed-frame.glb",
  "specifications": {
    "dimensions": "210cm x 160cm x 120cm",
    "material": "Upholstered Fabric & Wood",
    "color": "Light Gray",
    "weight": "55kg",
    "size": "Queen (160cm x 200cm)",
    "headboardHeight": "120cm"
  }
}
```

---

# 📝 **Phase 5: Update Product Schema (Add GLB Field)**

Your current schema already supports most fields, but let's add `glbModel` field for 3D models.

## **Update product.model.js**

Add this field to your schema:

```javascript
glbModel: {
  type: String,
  trim: true,
},
subcategory: {
  type: String,
  trim: true,
},
```

**Full updated schema:**

```javascript
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
    subcategory: {  // NEW FIELD
      type: String,
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
    glbModel: {  // NEW FIELD for 3D models
      type: String,
      trim: true,
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
```

---

# 🧪 **Phase 6: Add Products via Postman**

## **Step 1: Login as Admin**

```
POST http://localhost:5000/api/auth/admin/login
Body:
{
  "email": "admin@gmail.com",
  "password": "admin12345"
}

→ Copy accessToken
```

---

## **Step 2: Create Furniture Products**

For each furniture product:

```
POST http://localhost:5000/api/admin/products
Authorization: Bearer (admin token)

Body: (Use the product JSON from above, with YOUR Cloudinary URLs)
```

**Example:**

```json
{
  "name": "Modern 3-Seater Sofa",
  "description": "Elegant and comfortable sofa perfect for living rooms",
  "price": 899,
  "category": "Furniture",
  "subcategory": "Living Room",
  "stock": 15,
  "brand": "IKEA",
  "images": [
    "https://res.cloudinary.com/dab12cd3e/image/upload/v1/furniture/sofa-front.jpg"
  ],
  "glbModel": "https://res.cloudinary.com/dab12cd3e/raw/upload/v1/furniture-models/sofa.glb",
  "specifications": {
    "dimensions": "200cm x 90cm x 85cm",
    "material": "Premium Fabric",
    "color": "Charcoal Gray"
  }
}
```

---

## **Step 3: Verify in MongoDB Compass**

1. Open MongoDB Compass
2. Refresh `products` collection
3. You should see your furniture products with:
   - ✅ Product details
   - ✅ Cloudinary image URLs
   - ✅ GLB model URLs
   - ✅ Specifications

---

# ✅ **Phase 7: Test APIs**

## **Test 1: View All Furniture Products (Public)**

```
GET http://localhost:5000/api/products
```

**Verify:**
- ✅ All furniture products shown
- ✅ Images are Cloudinary URLs
- ✅ GLB models are Cloudinary URLs

---

## **Test 2: View Single Product**

```
GET http://localhost:5000/api/products/PRODUCT_ID
```

**Verify:**
- ✅ Product details correct
- ✅ Specifications shown
- ✅ GLB model URL present

---

## **Test 3: Filter by Category**

```
GET http://localhost:5000/api/products?category=Furniture
```

**Verify:**
- ✅ Only furniture products shown

---

## **Test 4: User Adds Furniture to Favorites**

```
POST http://localhost:5000/api/favorites
Authorization: Bearer (user token)
Body: { "productId": "FURNITURE_PRODUCT_ID" }
```

**Verify:**
- ✅ Furniture added to favorites
- ✅ Can view in favorites list

---

# 📊 **Summary Checklist**

## **Setup:**
- [ ] Created Cloudinary account
- [ ] Got Cloud Name, API Key, API Secret
- [ ] Updated `.env` file with Cloudinary credentials

## **Upload:**
- [ ] Uploaded GLB files to Cloudinary
- [ ] Got URLs for all GLB files
- [ ] Got URLs for product images

## **Database:**
- [ ] Deleted dummy test products
- [ ] Updated product schema (added glbModel field)
- [ ] Added real furniture products via Postman

## **Testing:**
- [ ] Tested view all products
- [ ] Tested view single product
- [ ] Tested filtering
- [ ] Tested favorites with furniture
- [ ] Verified data in MongoDB Compass

---

# 🎯 **Next Steps**

1. **Frontend Integration:**
   - Use product image URLs in product cards
   - Use GLB model URLs for AR viewer
   - Display specifications in product details

2. **AR Features:**
   - Load GLB models in AR viewer
   - Allow users to place furniture in their space
   - Add "View in AR" button

3. **Additional Features:**
   - Add product reviews
   - Add product ratings
   - Add product variants (colors, sizes)

---

# 💡 **Important Notes**

1. **Cloudinary URLs are permanent** - Once uploaded, URLs don't change
2. **GLB files should be optimized** - Keep file size under 10MB for fast loading
3. **Use `resource_type: 'raw'`** when uploading GLB files to Cloudinary
4. **Test AR viewer** with GLB URLs before adding all products

---

**You're all set! Follow these steps and your furniture products will be live with AR support!** 🚀
