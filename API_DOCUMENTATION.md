# NearExpiry API Documentation

Base URL: \`http://localhost:5000/api\`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

---

## Authentication Endpoints

### Register User
\`\`\`
POST /auth/register

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer" | "seller"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
\`\`\`

### Login
\`\`\`
POST /auth/login

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}

Errors:
401 - Invalid credentials
\`\`\`

### Get Current User
\`\`\`
GET /auth/me
Authorization: Bearer <token>

Response (200):
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "buyer",
  "phone": "9999999999",
  "wasteSavedKg": 2.5,
  "greenPoints": 500
}

Errors:
401 - No token / Invalid token
\`\`\`

---

## Product Endpoints

### Get All Products
\`\`\`
GET /products?category=soap&sortBy=discount&page=1&limit=20

Query Parameters:
- category: String (optional) - soap, toothpaste, shampoo, detergent, cleaner, baby-care, cosmetics
- sortBy: String (optional) - new, discount, expiry, price-low, price-high
- page: Number (optional) - default: 1
- limit: Number (optional) - default: 20

Response (200):
{
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Dove Organic Soap 100g",
      "category": "soap",
      "description": "Pure and gentle organic soap bar",
      "originalPrice": 150,
      "currentPrice": 90,
      "discountPercentage": 40,
      "expiryDate": "2025-12-10T00:00:00.000Z",
      "daysUntilExpiry": 10,
      "discountTier": "good-deal",
      "quantity": 150,
      "rating": 4.5,
      "status": "active",
      "seller": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Freshmart Supplies",
        "avatar": "..."
      }
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 5
  }
}
\`\`\`

### Get Product by ID
\`\`\`
GET /products/:id

Response (200):
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Dove Organic Soap 100g",
  "category": "soap",
  "description": "Pure and gentle organic soap bar",
  "originalPrice": 150,
  "currentPrice": 90,
  "discountPercentage": 40,
  "expiryDate": "2025-12-10T00:00:00.000Z",
  "daysUntilExpiry": 10,
  "discountTier": "good-deal",
  "quantity": 150,
  "rating": 4.5,
  "reviews": [
    {
      "user": { "_id": "...", "name": "John Doe", "avatar": "..." },
      "rating": 5,
      "comment": "Great quality!",
      "createdAt": "2025-11-20T10:00:00.000Z"
    }
  ],
  "status": "active",
  "seller": { ... }
}

Errors:
404 - Product not found
\`\`\`

### Create Product (Seller Only)
\`\`\`
POST /products
Authorization: Bearer <seller-token>

Body:
{
  "name": "New Soap",
  "category": "soap",
  "description": "Product description",
  "originalPrice": 200,
  "discountPercentage": 30,
  "quantity": 100,
  "expiryDate": "2025-12-31",
  "images": []
}

Response (200):
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "New Soap",
  "seller": "507f1f77bcf86cd799439012",
  ...
}

Errors:
403 - Only sellers can create products
401 - Unauthorized
\`\`\`

### Add Product Review
\`\`\`
POST /products/:id/review
Authorization: Bearer <token>

Body:
{
  "rating": 5,
  "comment": "Excellent product!"
}

Response (200):
{
  "reviews": [
    {
      "user": "507f1f77bcf86cd799439011",
      "rating": 5,
      "comment": "Excellent product!",
      "createdAt": "2025-11-20T15:30:00.000Z"
    }
  ]
}

Errors:
401 - Must be logged in to review
404 - Product not found
\`\`\`

---

## Order Endpoints

### Create Order
\`\`\`
POST /orders
Authorization: Bearer <buyer-token>

Body:
{
  "products": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2
    }
  ],
  "deliveryType": "delivery",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "MH",
    "pincode": "400001"
  }
}

Response (200):
{
  "_id": "507f1f77bcf86cd799439050",
  "buyer": "507f1f77bcf86cd799439011",
  "products": [
    {
      "product": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "price": 90
    }
  ],
  "totalAmount": 180,
  "finalAmount": 180,
  "status": "pending",
  "deliveryType": "delivery",
  "paymentStatus": "completed",
  "wasteSavedKg": 0.05,
  "greenPointsEarned": 50,
  "createdAt": "2025-11-20T15:30:00.000Z"
}

Errors:
401 - Must be logged in
404 - Product not found
\`\`\`

### Get User Orders
\`\`\`
GET /orders
Authorization: Bearer <buyer-token>

Response (200):
[
  {
    "_id": "507f1f77bcf86cd799439050",
    "products": [ ... ],
    "totalAmount": 180,
    "finalAmount": 180,
    "status": "delivered",
    "wasteSavedKg": 0.05,
    "greenPointsEarned": 50
  }
]

Errors:
401 - Unauthorized
\`\`\`

### Get Order Details
\`\`\`
GET /orders/:id
Authorization: Bearer <token>

Response (200):
{
  "_id": "507f1f77bcf86cd799439050",
  "buyer": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9999999999"
  },
  "products": [
    {
      "product": { ... },
      "quantity": 2,
      "price": 90
    }
  ],
  "totalAmount": 180,
  "finalAmount": 180,
  "status": "delivered",
  "wasteSavedKg": 0.05,
  "greenPointsEarned": 50
}

Errors:
404 - Order not found
401 - Unauthorized
\`\`\`

---

## Seller Endpoints

### Get Seller's Products
\`\`\`
GET /seller/my-products
Authorization: Bearer <seller-token>

Response (200):
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Dove Soap",
    "category": "soap",
    "currentPrice": 90,
    "quantity": 150,
    "status": "active"
  }
]

Errors:
403 - Only sellers can access this
401 - Unauthorized
\`\`\`

### Get Seller's Sales
\`\`\`
GET /seller/my-sales
Authorization: Bearer <seller-token>

Response (200):
[
  {
    "_id": "507f1f77bcf86cd799439050",
    "buyer": {
      "name": "John Doe",
      "phone": "9999999999"
    },
    "products": [ ... ],
    "finalAmount": 180,
    "status": "delivered"
  }
]

Errors:
403 - Only sellers can access this
401 - Unauthorized
\`\`\`

---

## Error Responses

### 400 Bad Request
\`\`\`json
{
  "error": "Validation error or missing required fields"
}
\`\`\`

### 401 Unauthorized
\`\`\`json
{
  "error": "No token provided" | "Invalid token"
}
\`\`\`

### 403 Forbidden
\`\`\`json
{
  "error": "Only sellers can access this"
}
\`\`\`

### 404 Not Found
\`\`\`json
{
  "error": "Product not found" | "Order not found"
}
\`\`\`

### 500 Internal Server Error
\`\`\`json
{
  "error": "Server error message"
}
\`\`\`

---

## Rate Limits

Currently no rate limiting. Production deployment should include:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Pagination

Most list endpoints support pagination:
- \`page\`: Page number (default: 1)
- \`limit\`: Items per page (default: 20, max: 100)

Response includes pagination metadata:
\`\`\`json
{
  "data": [ ... ],
  "pagination": {
    "total": 150,
    "page": 1,
    "pages": 8
  }
}
\`\`\`

---

## Sorting Options

Products can be sorted by:
- \`new\`: Newest first (default)
- \`discount\`: Highest discount first
- \`expiry\`: Expiring soon first
- \`price-low\`: Price ascending
- \`price-high\`: Price descending

---

## Categories

Supported product categories:
- soap
- toothpaste
- shampoo
- detergent
- cleaner
- baby-care
- cosmetics
- grooming

---

## Status Values

### Order Status
- pending: Order placed, awaiting confirmation
- confirmed: Order confirmed by seller
- shipped: Order shipped
- delivered: Order delivered
- cancelled: Order cancelled

### Product Status
- active: Available for purchase
- sold-out: Out of stock
- inactive: Removed from marketplace

### Discount Tiers (Auto-calculated)
- hot-deal: 0-7 days until expiry
- good-deal: 8-15 days until expiry
- fair-deal: 16+ days until expiry

---

## Example Usage

### Complete Buyer Flow
\`\`\`bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","password":"pass123","role":"buyer"}'

# 2. Login
TOKEN=\$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"pass123"}' | jq -r '.token')

# 3. Browse products
curl "http://localhost:5000/api/products?category=soap&sortBy=discount"

# 4. Place order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "products":[{"productId":"507f1f77bcf86cd799439011","quantity":1}],
    "deliveryType":"delivery",
    "shippingAddress":{"street":"123 Main","city":"Mumbai","state":"MH","pincode":"400001"}
  }'

# 5. View orders
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN"
\`\`\`

---

Version: 1.0.0
Last Updated: November 2025
