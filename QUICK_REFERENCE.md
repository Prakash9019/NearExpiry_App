# NearExpiry - Quick Reference Guide

## 30-Second Start

\`\`\`bash
npm install
cd server && npm install && cd ../client && npm install && cd ..
cd server && npm run seed
npm run dev
# Visit http://localhost:3000
\`\`\`

## Login Credentials

### Seller Accounts
\`\`\`
Email: seller1@nearexpiry.com
Pass: password123

Email: seller2@nearexpiry.com  
Pass: password123
\`\`\`

### Buyer Accounts
\`\`\`
Email: buyer1@nearexpiry.com
Pass: password123

Email: buyer2@nearexpiry.com
Pass: password123
\`\`\`

## Key URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Frontend app |
| http://localhost:5000 | Backend API |
| http://localhost:5000/api/health | API health check |

## Important Files

| File | Purpose |
|------|---------|
| server/index.js | Express server entry |
| client/src/App.jsx | React app root |
| server/models/*.js | Database schemas |
| server/routes/*.js | API endpoints |
| client/src/pages/*.jsx | Page components |
| server/scripts/seed-data.js | Sample data |

## Common Commands

\`\`\`bash
# Development
npm run dev              # Run both servers
cd server && npm run dev # Run server only
cd client && npm run dev # Run client only

# Database
cd server && npm run seed     # Add sample data
mongo                         # Open MongoDB shell
use nearexpiry
db.products.find({}).pretty() # View products

# Build
cd client && npm run build    # Build frontend

# Cleanup
rm -rf server/node_modules client/node_modules
npm install
\`\`\`

## Database Schema Quick Reference

### User
\`\`\`
name, email, password, role (buyer/seller), phone, address, 
isVerified, wasteSavedKg, greenPoints
\`\`\`

### Product
\`\`\`
seller (ref), name, category, description, originalPrice, 
discountPercentage, currentPrice, expiryDate, daysUntilExpiry,
discountTier (hot-deal/good-deal/fair-deal), quantity, rating,
reviews, status (active/sold-out)
\`\`\`

### Order
\`\`\`
buyer (ref), products[], totalAmount, finalAmount, status, 
deliveryType, shippingAddress, paymentStatus, wasteSavedKg,
greenPointsEarned
\`\`\`

## API Endpoint Reference

\`\`\`
POST   /auth/register           - Create user
POST   /auth/login              - Login
GET    /auth/me                 - Get profile

GET    /products                - List products
GET    /products/:id            - Get product
POST   /products                - Add product (seller)
POST   /products/:id/review     - Add review

POST   /orders                  - Place order
GET    /orders                  - Get user orders
GET    /orders/:id              - Get order details

GET    /seller/my-products      - Seller products
GET    /seller/my-sales         - Seller sales
\`\`\`

## Page Routes

\`\`\`
/                    - Home
/login               - Login page
/register            - Sign up page
/marketplace         - Browse products
/product/:id         - Product details
/cart                - Shopping cart
/orders              - Order history
/profile             - User profile
/seller-dashboard    - Seller dashboard
\`\`\`

## Discount Tiers (Auto-calculated)

| Tier | Days to Expiry | Badge |
|------|----------------|-------|
| Hot Deal | 0-7 | 🔥 |
| Good Deal | 8-15 | ⭐ |
| Fair Deal | 16+ | ✓ |

## Discount Range by Category

| Category | Discount % |
|----------|-----------|
| Soap | 30-50% |
| Toothpaste | 35-55% |
| Shampoo | 40-60% |
| Detergent | 25-45% |
| Cleaner | 20-40% |
| Baby Care | 30-50% |
| Cosmetics | 40-60% |

## Features Checklist

### Buyer Features
- [x] Registration & Login
- [x] Browse marketplace
- [x] Filter by category
- [x] Sort by: new, discount, expiry, price
- [x] Product details & reviews
- [x] Add to cart
- [x] Checkout with address
- [x] Order history
- [x] Profile with green stats
- [x] Waste & points tracking

### Seller Features  
- [x] Registration & Login
- [x] Dashboard with stats
- [x] Add products
- [x] Auto price calculation
- [x] Expiry-based discounts
- [x] Sales tracking
- [x] Order management
- [x] Revenue analytics

### System Features
- [x] JWT authentication
- [x] Role-based access
- [x] Search & filtering
- [x] Pagination
- [x] Reviews & ratings
- [x] Green points
- [x] Waste saved tracking
- [x] Responsive design
- [x] Error handling
- [x] Sample data

## Troubleshooting

### App won't start
\`\`\`
1. Check ports 3000 & 5000 not in use
2. npm install from root and both folders
3. Check .env files exist
4. Ensure MongoDB is running
\`\`\`

### MongoDB connection error
\`\`\`
brew services start mongodb-community  # macOS
# or use MongoDB Atlas connection string
\`\`\`

### CORS errors
\`\`\`
1. Check backend running on :5000
2. Check frontend running on :3000
3. Verify CORS_ORIGIN in server/.env
4. Restart both servers
\`\`\`

### Token issues
\`\`\`
1. Clear localStorage: DevTools → Application → Clear
2. Logout and login again
3. Check JWT_SECRET in server/.env
4. Verify Authorization header format
\`\`\`

### Product not appearing
\`\`\`
1. Check seller is verified
2. Ensure product status is 'active'
3. Check quantity > 0
4. Verify product isn't expired (manually update date)
5. Run npm run seed to reset
\`\`\`

## Performance Tips

- Use discount sort for hot deals
- Filter by category to narrow results
- Browser caching enabled by default
- Use local storage for cart (automatic)
- Pagination: 20 items per page

## Development Workflow

\`\`\`
1. Frontend changes: Saves automatically (Vite hot reload)
2. Backend changes: Restart server (nodemon watches)
3. Database changes: Run seed script
4. New endpoints: Test with curl or Postman
5. Git: Commit regularly
\`\`\`

## File Modification Guide

### To Add New Category
1. Update CATEGORIES in MarketplacePage.jsx
2. Update seed-data.js
3. Update API validation if needed

### To Change Pricing
1. Edit Product.js schema
2. Update price calculation in Product model
3. Re-seed database

### To Modify UI
1. Edit CSS in client/src/styles/index.css
2. Or component-specific styles
3. Use Tailwind-like classes

### To Add New Routes
1. Create controller function in server/routes/
2. Define MongoDB schema if needed
3. Add error handling
4. Update API documentation
5. Update frontend context/pages

## Color Palette

\`\`\`css
--primary: #1f2937 (Dark gray)
--secondary: #10b981 (Green)
--accent: #f97316 (Orange)
--danger: #ef4444 (Red)
--success: #10b981 (Green)
--warning: #f59e0b (Amber)
\`\`\`

## Useful Curl Commands

\`\`\`bash
# Check server health
curl http://localhost:5000/api/health

# Get all products
curl http://localhost:5000/api/products

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer1@nearexpiry.com","password":"password123"}'

# Create order (replace TOKEN)
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "products":[{"productId":"ID","quantity":1}],
    "deliveryType":"delivery",
    "shippingAddress":{"street":"123","city":"City","state":"ST","pincode":"12345"}
  }'
\`\`\`

## Next Development Steps

1. **Immediate**
   - Deploy to Heroku/Railway (backend)
   - Deploy to Vercel/Netlify (frontend)
   - Add real payment gateway

2. **Short-term**
   - Add user image uploads
   - Implement push notifications
   - Add admin dashboard
   - Write unit tests

3. **Medium-term**
   - Mobile app (React Native)
   - AI-based recommendations
   - Email notifications
   - Bulk/B2B features

4. **Long-term**
   - Multi-city expansion
   - International support
   - Sustainability partnerships
   - Analytics platform

## Resources

- **MongoDB**: https://docs.mongodb.com
- **Express**: https://expressjs.com
- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **JWT**: https://jwt.io

## Important Notes

- All prices are in ₹ (Indian Rupees)
- Demo uses emoji for product images
- Use real image URLs in production
- All dates are auto-calculated based on expiry
- Green points are automatically awarded
- Passwords are hashed with bcrypt

## Support

For issues:
1. Check SETUP_GUIDE.md for detailed setup
2. Check API_DOCUMENTATION.md for endpoint info
3. Check this file for quick fixes
4. Review console logs for errors

---

**Save money. Save the planet. 🌍💚**
