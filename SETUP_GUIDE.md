# NearExpiry Marketplace - Complete Setup Guide

## Quick Start (5 minutes)

### 1. Prerequisites Check
- [x] Node.js v18+ installed
- [x] MongoDB running locally or Atlas connection string
- [x] Git installed
- [x] Terminal/Command prompt access

### 2. Clone & Install
\`\`\`bash
# Clone repository
git clone <repo-url>
cd nearexpiry-marketplace

# Install root dependencies
npm install

# Install server
cd server
npm install

# Install client
cd ../client
npm install
cd ..
\`\`\`

### 3. Environment Setup
\`\`\`bash
# Server setup
cd server
cp .env.example .env

# Edit .env file and add:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/nearexpiry
# JWT_SECRET=your-secret-key-here

cd ../client
cp .env.example .env
# Update if needed (default values are fine for local dev)

cd ..
\`\`\`

### 4. MongoDB Setup

#### Option A: Local MongoDB
\`\`\`bash
# On macOS with Homebrew
brew services start mongodb-community

# On Windows
# Download from https://www.mongodb.com/try/download/community
# Run MongoDB installer and start the service
\`\`\`

#### Option B: MongoDB Atlas (Cloud)
\`\`\`bash
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create free account
# 3. Create cluster
# 4. Get connection string
# 5. Update MONGODB_URI in server/.env

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nearexpiry?retryWrites=true&w=majority
\`\`\`

### 5. Seed Sample Data
\`\`\`bash
cd server
npm run seed

# Output:
# Created 2 sellers
# Created 15 products with dynamic pricing
# Created 2 sample buyers
\`\`\`

### 6. Start Development Servers
\`\`\`bash
# From root directory
npm run dev

# This starts:
# - Backend: http://localhost:5000
# - Frontend: http://localhost:3000

# Or run separately:
# Terminal 1: cd server && npm run dev
# Terminal 2: cd client && npm run dev
\`\`\`

### 7. Test the App
\`\`\`
Frontend: http://localhost:3000
Backend API: http://localhost:5000/api/health
\`\`\`

## Sample Accounts

### Sellers
\`\`\`
Email: seller1@nearexpiry.com
Password: password123
Type: Seller (Has Dashboard)

Email: seller2@nearexpiry.com
Password: password123
Type: Seller (Has Dashboard)
\`\`\`

### Buyers
\`\`\`
Email: buyer1@nearexpiry.com
Password: password123
Type: Buyer (Browse Marketplace)

Email: buyer2@nearexpiry.com
Password: password123
Type: Buyer (Browse Marketplace)
\`\`\`

## Testing Flows

### Test as Buyer
1. Go to http://localhost:3000
2. Click "Sign Up" → Select "Buyer" 
3. Use: buyer1@nearexpiry.com / password123
4. Click "Marketplace"
5. Browse products (15 sample products available)
6. Click product → View details → Add to cart
7. Go to cart → Fill address → Place order
8. View orders page to see saved waste & green points

### Test as Seller
1. Go to http://localhost:3000
2. Click "Sign Up" → Select "Seller"
3. Use: seller1@nearexpiry.com / password123
4. Click "Seller Dashboard"
5. See products and sales stats
6. Click "Add Product"
7. Fill form: name, category, price, discount, quantity, expiry date
8. Product goes live with auto-calculated discount tier
9. View sales as buyers place orders

### Test Product Features
- **Dynamic Pricing**: Products with fewer days to expiry get higher discounts
- **Expiry Tiers**: 
  - 0-7 days: 🔥 Hot Deal
  - 8-15 days: ⭐ Good Deal
  - 16+ days: ✓ Fair Deal
- **Green Impact**: Track waste saved and carbon reduction
- **Waste Calculation**: 0.05 kg saved per order

## Troubleshooting

### MongoDB Connection Error
\`\`\`
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Ensure MongoDB is running: brew services list (macOS)
2. Or use MongoDB Atlas with connection string
3. Check MONGODB_URI in server/.env
\`\`\`

### Port Already in Use
\`\`\`
Error: Port 5000 already in use

Solution:
# Find process on port 5000 and kill it
# On macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Or change PORT in server/.env to 5001
\`\`\`

### CORS Errors
\`\`\`
Error: Access to XMLHttpRequest blocked by CORS policy

Solution:
1. Check server is running on http://localhost:5000
2. Verify CORS_ORIGIN in server/.env
3. Restart both servers
\`\`\`

### Module Not Found Errors
\`\`\`
Solution:
# Clear node_modules and reinstall
rm -rf server/node_modules client/node_modules
npm install
cd server && npm install
cd ../client && npm install
\`\`\`

## Database Schema

### Users
\`\`\`
{
  _id: ObjectId
  name: String
  email: String (unique)
  password: String (hashed)
  role: 'buyer' | 'seller'
  phone: String
  address: { street, city, state, pincode }
  isVerified: Boolean
  wasteSavedKg: Number
  greenPoints: Number
}
\`\`\`

### Products
\`\`\`
{
  _id: ObjectId
  seller: ObjectId (ref: User)
  name: String
  category: String
  description: String
  originalPrice: Number
  discountPercentage: Number
  currentPrice: Number
  expiryDate: Date
  daysUntilExpiry: Number
  discountTier: 'hot-deal' | 'good-deal' | 'fair-deal'
  quantity: Number
  rating: Number
  reviews: [{ user, rating, comment, createdAt }]
  status: 'active' | 'sold-out' | 'inactive'
}
\`\`\`

### Orders
\`\`\`
{
  _id: ObjectId
  buyer: ObjectId (ref: User)
  products: [{ product, quantity, price }]
  totalAmount: Number
  finalAmount: Number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  deliveryType: 'delivery' | 'pickup'
  shippingAddress: { street, city, state, pincode }
  paymentStatus: 'pending' | 'completed'
  wasteSavedKg: Number (0.05 default)
  greenPointsEarned: Number (50 default)
}
\`\`\`

## API Testing

### Health Check
\`\`\`bash
curl http://localhost:5000/api/health
# { "status": "ok" }
\`\`\`

### Register User
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "buyer"
  }'
\`\`\`

### Login
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer1@nearexpiry.com",
    "password": "password123"
  }'
\`\`\`

### Get Products
\`\`\`bash
curl "http://localhost:5000/api/products?category=soap&sortBy=discount&page=1&limit=10"
\`\`\`

### Get User Profile
\`\`\`bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

## Development Tips

### Hot Reload
- Backend: Enabled with \`--watch\` flag
- Frontend: Automatic with Vite

### Debug Products
\`\`\`bash
# MongoDB shell
mongosh
use nearexpiry
db.products.find({}).pretty()
db.users.find({}).pretty()
\`\`\`

### Clear Database
\`\`\`bash
# MongoDB shell
mongosh
use nearexpiry
db.products.deleteMany({})
db.users.deleteMany({})
db.orders.deleteMany({})
# Then reseed: npm run seed
\`\`\`

## Production Deployment

### Backend (Heroku)
\`\`\`bash
# 1. Create Heroku app
heroku create nearexpiry-api

# 2. Add environment variables
heroku config:set MONGODB_URI=<your-atlas-uri>
heroku config:set JWT_SECRET=<generate-random-secret>

# 3. Deploy
git push heroku main
\`\`\`

### Frontend (Vercel)
\`\`\`bash
# 1. Build
npm run build

# 2. Deploy (automatic from GitHub)
# Or use Vercel CLI
vercel
\`\`\`

### Environment Variables (Production)
\`\`\`
Backend:
- MONGODB_URI=<production-mongodb-atlas-url>
- JWT_SECRET=<strong-random-secret>
- CORS_ORIGIN=<your-frontend-domain>
- NODE_ENV=production

Frontend:
- VITE_API_BASE_URL=<your-backend-domain>
\`\`\`

## Next Steps

1. **Add Payment Gateway**: Stripe/Razorpay integration
2. **Image Upload**: AWS S3 for product images
3. **Email Notifications**: SendGrid for order updates
4. **Push Notifications**: Firebase for app notifications
5. **Admin Dashboard**: Manage users, products, orders
6. **Mobile App**: React Native version
7. **Analytics**: Track metrics and user behavior

## Support & Resources

- MongoDB Docs: https://docs.mongodb.com
- Express.js: https://expressjs.com
- React: https://react.dev
- Vite: https://vitejs.dev

---

Happy coding! Save money, save the planet! 🌍💚
\`\`\`
