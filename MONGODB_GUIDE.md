# 📊 MongoDB Database Guide

## Database Overview

**Database Name**: `AR-Ecommerce`  
**Cluster**: `cluster0.elhjya7.mongodb.net`  
**Connection String**: Already configured in `.env`

---

## 📁 Collections Structure

Your MongoDB database has 3 main collections:

### 1. **users** Collection
Created by Kashaf for authentication

```javascript
{
  _id: ObjectId("..."),
  fullName: "John Doe",
  email: "john@example.com",
  password: "$2a$10$...", // Hashed password
  role: "user", // or "admin"
  isBlocked: false,
  phoneNumber: "1234567890",
  refreshToken: "...",
  createdAt: ISODate("2024-01-01T00:00:00.000Z"),
  updatedAt: ISODate("2024-01-01T00:00:00.000Z")
}
```

**Indexes:**
- `email` (unique)

---

### 2. **products** Collection
For storing product information

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "iPhone 15 Pro",
  description: "Latest iPhone with A17 Pro chip and titanium design",
  price: 999,
  category: "Electronics",
  stock: 50,
  images: [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  rating: 4.5,
  numReviews: 120,
  isActive: true,
  brand: "Apple",
  specifications: {
    color: "Titanium Blue",
    storage: "256GB",
    ram: "8GB",
    processor: "A17 Pro"
  },
  createdAt: ISODate("2024-01-01T00:00:00.000Z"),
  updatedAt: ISODate("2024-01-01T00:00:00.000Z")
}
```

**Indexes:**
- Text index on `name`, `description`, `category` (for search)

**Field Details:**
- `name` (String, required) - Product name
- `description` (String, required) - Product description
- `price` (Number, required) - Product price (must be >= 0)
- `category` (String, required) - Product category
- `stock` (Number, default: 0) - Available quantity
- `images` (Array of Strings) - Product image URLs
- `rating` (Number, 0-5) - Average rating
- `numReviews` (Number) - Total number of reviews
- `isActive` (Boolean, default: true) - Product visibility
- `brand` (String) - Brand name
- `specifications` (Map) - Key-value pairs for product specs

---

### 3. **favorites** Collection
For storing user favorites (wishlist)

```javascript
{
  _id: ObjectId("..."),
  user: ObjectId("507f191e810c19729de860ea"), // Reference to users collection
  product: ObjectId("507f1f77bcf86cd799439011"), // Reference to products collection
  createdAt: ISODate("2024-01-01T00:00:00.000Z"),
  updatedAt: ISODate("2024-01-01T00:00:00.000Z")
}
```

**Indexes:**
- Compound unique index on `user` + `product` (prevents duplicate favorites)

**Relationships:**
- `user` → References `users._id`
- `product` → References `products._id`

---

## 🔍 Sample Queries

### View All Collections
```javascript
// In MongoDB Compass or Shell
show collections
```

### Count Documents
```javascript
// Count products
db.products.countDocuments()

// Count active products
db.products.countDocuments({ isActive: true })

// Count favorites
db.favorites.countDocuments()
```

### Find Products
```javascript
// Find all products
db.products.find()

// Find by category
db.products.find({ category: "Electronics" })

// Find by price range
db.products.find({ price: { $gte: 100, $lte: 1000 } })

// Search by name
db.products.find({ name: { $regex: "iPhone", $options: "i" } })

// Find inactive products
db.products.find({ isActive: false })
```

### Find Favorites
```javascript
// Find all favorites
db.favorites.find()

// Find favorites for a specific user
db.favorites.find({ user: ObjectId("USER_ID") })

// Find who favorited a specific product
db.favorites.find({ product: ObjectId("PRODUCT_ID") })

// Count favorites for a product
db.favorites.countDocuments({ product: ObjectId("PRODUCT_ID") })
```

### Aggregation Queries

#### Most Favorited Products
```javascript
db.favorites.aggregate([
  {
    $group: {
      _id: "$product",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  },
  {
    $limit: 10
  },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "productDetails"
    }
  }
])
```

#### Users with Most Favorites
```javascript
db.favorites.aggregate([
  {
    $group: {
      _id: "$user",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  },
  {
    $limit: 10
  }
])
```

#### Products by Category Count
```javascript
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      count: { $sum: 1 },
      avgPrice: { $avg: "$price" }
    }
  },
  {
    $sort: { count: -1 }
  }
])
```

---

## 🛠️ Useful MongoDB Operations

### Insert Sample Products
```javascript
db.products.insertMany([
  {
    name: "iPhone 15 Pro",
    description: "Latest iPhone with A17 Pro chip",
    price: 999,
    category: "Electronics",
    stock: 50,
    images: ["https://example.com/iphone.jpg"],
    brand: "Apple",
    isActive: true,
    rating: 0,
    numReviews: 0,
    specifications: {
      color: "Titanium Blue",
      storage: "256GB"
    }
  },
  {
    name: "Samsung Galaxy S24",
    description: "Flagship Android phone",
    price: 899,
    category: "Electronics",
    stock: 40,
    images: ["https://example.com/samsung.jpg"],
    brand: "Samsung",
    isActive: true,
    rating: 0,
    numReviews: 0
  },
  {
    name: "Nike Air Max",
    description: "Comfortable running shoes",
    price: 150,
    category: "Fashion",
    stock: 100,
    images: ["https://example.com/nike.jpg"],
    brand: "Nike",
    isActive: true,
    rating: 0,
    numReviews: 0
  }
])
```

### Update Product
```javascript
// Update price
db.products.updateOne(
  { _id: ObjectId("PRODUCT_ID") },
  { $set: { price: 899 } }
)

// Update stock
db.products.updateOne(
  { _id: ObjectId("PRODUCT_ID") },
  { $set: { stock: 100 } }
)

// Toggle active status
db.products.updateOne(
  { _id: ObjectId("PRODUCT_ID") },
  { $set: { isActive: false } }
)
```

### Delete Operations
```javascript
// Delete a product
db.products.deleteOne({ _id: ObjectId("PRODUCT_ID") })

// Delete all favorites for a user
db.favorites.deleteMany({ user: ObjectId("USER_ID") })

// Delete all favorites for a product
db.favorites.deleteMany({ product: ObjectId("PRODUCT_ID") })
```

---

## 📊 Data Validation Rules

### Products
- ✅ `name` must be a non-empty string
- ✅ `description` must be a non-empty string
- ✅ `price` must be a number >= 0
- ✅ `category` must be a non-empty string
- ✅ `stock` must be a number >= 0
- ✅ `rating` must be between 0 and 5
- ✅ `isActive` must be boolean

### Favorites
- ✅ `user` must be a valid ObjectId referencing users collection
- ✅ `product` must be a valid ObjectId referencing products collection
- ✅ Each user can favorite a product only once (enforced by unique index)

---

## 🔐 Access MongoDB

### Option 1: MongoDB Compass (GUI)
1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Connect using connection string from `.env`:
   ```
   mongodb+srv://Kashaf:kashaf123@cluster0.elhjya7.mongodb.net/AR-Ecommerce
   ```
3. Browse collections visually

### Option 2: MongoDB Shell
```bash
# Install MongoDB Shell
# Then connect:
mongosh "mongodb+srv://Kashaf:kashaf123@cluster0.elhjya7.mongodb.net/AR-Ecommerce"
```

### Option 3: MongoDB Atlas Web Interface
1. Go to https://cloud.mongodb.com
2. Login with Kashaf's credentials
3. Navigate to Cluster0 → Browse Collections

---

## 📈 Monitoring & Statistics

### Check Database Size
```javascript
db.stats()
```

### Check Collection Statistics
```javascript
db.products.stats()
db.favorites.stats()
db.users.stats()
```

### View Indexes
```javascript
db.products.getIndexes()
db.favorites.getIndexes()
db.users.getIndexes()
```

---

## 🚨 Important Notes

### Data Relationships
- When a product is deleted, you should also delete all related favorites
- When a user is deleted, you should also delete all their favorites
- Currently, these are NOT automatically handled (no cascade delete)

### Recommendations for Future
1. **Add cascade delete logic** in your API when deleting users/products
2. **Add product reviews collection** for ratings and reviews
3. **Add orders collection** for purchase history
4. **Add cart collection** for shopping cart
5. **Add categories collection** for better category management

### Backup Strategy
- MongoDB Atlas automatically backs up your data
- You can also export collections manually:
```bash
mongoexport --uri="mongodb+srv://..." --collection=products --out=products.json
```

---

## 🎯 Next Steps

1. ✅ Verify collections exist in MongoDB Atlas
2. ✅ Insert sample products using API or MongoDB Compass
3. ✅ Test favorites functionality
4. 🔄 Add more collections as needed (reviews, orders, cart)
5. 🔄 Set up proper indexes for performance
6. 🔄 Implement data cleanup logic

---

## 📞 Need Help?

- MongoDB Documentation: https://docs.mongodb.com
- Mongoose Documentation: https://mongoosejs.com
- MongoDB University (Free Courses): https://university.mongodb.com

---

**Your database is ready to use! 🎉**
