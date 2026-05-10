# 🚀 Quick Start Guide - Product & Favorites APIs

## ⚡ 5-Minute Setup

### 1. Start the Server
```bash
cd backend
npm run dev
```

Expected output:
```
✓ MongoDB connected: cluster0.elhjya7.mongodb.net
Server running on port 5000
```

### 2. Import Postman Collection
1. Open Postman
2. Click **Import** button
3. Select `Postman_Collection.json` from backend folder
4. Collection will be imported with all endpoints ready

### 3. Test the APIs

#### Step 1: Login as Admin
1. Open **Authentication → Admin Login**
2. Click **Send**
3. Token will be automatically saved to `admin_token` variable

#### Step 2: Create a Product
1. Open **Products - Admin → Create Product**
2. Click **Send**
3. Product ID will be automatically saved to `product_id` variable

#### Step 3: View Products (Public)
1. Open **Products - Public → Get All Products**
2. Click **Send** (no authentication needed)

#### Step 4: Create User Account
1. Open **Authentication → User Signup**
2. Click **Send**

#### Step 5: Login as User
1. Open **Authentication → User Login**
2. Click **Send**
3. Token will be automatically saved to `user_token` variable

#### Step 6: Add Product to Favorites
1. Open **Favorites - User → Add to Favorites**
2. Click **Send**

#### Step 7: View My Favorites
1. Open **Favorites - User → Get My Favorites**
2. Click **Send**

---

## 📋 API Endpoints Summary

### Base URL
```
http://localhost:5000
```

### Products (Public - No Auth)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get by category

### Products (Admin Only)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `PATCH /api/admin/products/:id/toggle-status` - Toggle active/inactive
- `PATCH /api/admin/products/:id/stock` - Update stock
- `GET /api/admin/products` - Get all (including inactive)

### Favorites (User)
- `POST /api/favorites` - Add to favorites
- `GET /api/favorites` - Get my favorites
- `GET /api/favorites/check/:productId` - Check if favorited
- `DELETE /api/favorites/:productId` - Remove from favorites
- `DELETE /api/favorites/clear` - Clear all favorites

### Favorites (Admin)
- `GET /api/admin/favorites` - Get all favorites
- `GET /api/admin/favorites/stats` - Get statistics
- `DELETE /api/admin/favorites/:id` - Delete favorite

---

## 🔑 Authentication

### Admin Credentials
```
Email: admin@gmail.com
Password: admin12345
```

### User Credentials (after signup)
```
Email: john@example.com
Password: password123
```

### Using Tokens in Postman
Tokens are automatically saved when you login. The collection uses:
- `{{admin_token}}` for admin routes
- `{{user_token}}` for user routes

---

## 📦 Sample Product Data

```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with A17 Pro chip",
  "price": 999,
  "category": "Electronics",
  "stock": 50,
  "images": ["https://example.com/iphone.jpg"],
  "brand": "Apple",
  "specifications": {
    "color": "Titanium Blue",
    "storage": "256GB"
  }
}
```

---

## ✅ Testing Checklist

- [ ] Server is running
- [ ] Admin login successful
- [ ] Create product successful
- [ ] View products (public)
- [ ] User signup successful
- [ ] User login successful
- [ ] Add to favorites successful
- [ ] View favorites successful

---

## 🆘 Troubleshooting

### Server won't start
```bash
# Check if port 5000 is already in use
netstat -ano | findstr :5000

# Kill the process if needed
taskkill /PID <PID> /F
```

### MongoDB connection error
- Check internet connection
- Verify MONGO_URI in `.env` file
- Ensure MongoDB cluster is accessible

### Token expired
- Login again to get new token
- Tokens expire in 15 minutes

### "Not authorized" error
- Make sure you're using the correct token (admin vs user)
- Check Authorization header is set to Bearer Token

---

## 📚 Full Documentation

For detailed API documentation, see:
- `API_TESTING_GUIDE.md` - Complete testing guide
- `Postman_Collection.json` - Import into Postman

---

## 🎯 Next Steps

1. ✅ Test all endpoints using Postman
2. ✅ Create multiple products
3. ✅ Test favorites functionality
4. ✅ Test admin features
5. 🔄 Integrate with frontend
6. 🔄 Add more features (reviews, ratings, etc.)

---

## 💡 Tips

- Use Postman environments to switch between dev/prod
- Save common product IDs as variables
- Use Postman tests to automate token saving
- Check server console for detailed error messages

---

**Happy Testing! 🎉**
