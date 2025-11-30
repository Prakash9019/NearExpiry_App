# NearExpiry - Near-Expiry Household Goods Marketplace

A comprehensive MERN stack marketplace connecting buyers with discounted near-expiry household essentials from trusted sellers. Save money, save the planet!

## Features

### For Buyers
- Browse near-expiry household products (soaps, toothpaste, detergents, etc.)
- Filter by category and expiry dates
- Dynamic pricing based on days until expiry
- Shopping cart and secure checkout
- Real-time waste saved tracking
- Green points rewards system
- Order history and tracking

### For Sellers
- Upload inventory with expiry dates
- Track sales and revenue
- Manage product listings
- View customer orders
- Auto-calculated dynamic pricing based on expiry

### Core Features
- User authentication (Buyers & Sellers)
- Product search and filtering
- Real-time discount tiers (hot-deal, good-deal, fair-deal)
- Sustainability impact tracking
- User profiles with impact statistics
- Review and rating system

## Tech Stack

### Frontend
- React 18.2
- Vite (bundler)
- Lucide React (icons)
- React Router DOM (routing)
- Axios (HTTP client)
- CSS Grid & Flexbox (styling)

### Backend
- Node.js & Express.js
- MongoDB (database)
- Mongoose (ODM)
- JWT (authentication)
- Bcrypt (password hashing)

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd nearexpiry-marketplace
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Make sure MongoDB is running
# If using MongoDB locally: mongod
# If using MongoDB Atlas: update MONGODB_URI in .env

# Start server
npm run dev
# Server runs on http://localhost:5000
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd client

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start Vite dev server
npm run dev
# Frontend runs on http://localhost:3000
\`\`\`

### 4. Run Both (from root)
\`\`\`bash
npm run dev
# This runs both server and client concurrently
\`\`\`

## Project Structure

\`\`\`
nearexpiry-marketplace/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── seller.js
│   ├── middleware/
│   │   └── auth.js
│   ├── index.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── MarketplacePage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── SellerDashboardPage.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
\`\`\`

## API Endpoints

### Authentication
- POST \`/api/auth/register\` - Register new user
- POST \`/api/auth/login\` - Login user
- GET \`/api/auth/me\` - Get current user

### Products
- GET \`/api/products\` - Get all products (with filters)
- GET \`/api/products/:id\` - Get product details
- POST \`/api/products\` - Create product (seller only)
- POST \`/api/products/:id/review\` - Add review

### Orders
- POST \`/api/orders\` - Create order
- GET \`/api/orders\` - Get user orders
- GET \`/api/orders/:id\` - Get order details

### Seller Routes
- GET \`/api/seller/my-products\` - Get seller's products
- GET \`/api/seller/my-sales\` - Get seller's sales orders

## Example Data

### Seed Products
Products are automatically created when sellers upload them. The system includes:
- Soaps (discounts: 30-50%)
- Toothpaste (discounts: 35-55%)
- Shampoos (discounts: 40-60%)
- Detergents (discounts: 25-45%)
- Cleaners (discounts: 20-40%)

### Discount Tiers
- **Hot Deal** (🔥): 0-7 days until expiry
- **Good Deal** (⭐): 8-15 days until expiry
- **Fair Deal** (✓): 16+ days until expiry

## Key Features Explained

### Dynamic Pricing
- Discount increases as expiry date approaches
- Real-time calculation based on days until expiry
- Automatic tier assignment

### Green Points System
- Earn 50 points per order
- Track environmental impact
- Waste saved in kg
- Carbon saved in CO₂ equivalent

### Waste Saved Calculation
- Each purchase = 0.05 kg waste saved
- Cumulative tracking per user
- Environmental impact dashboard

## Testing the App

### Buyer Flow
1. Go to http://localhost:3000
2. Click "Sign Up" → select "Buyer"
3. Browse marketplace
4. Add products to cart
5. Checkout with delivery/pickup
6. View orders and green impact

### Seller Flow
1. Go to http://localhost:3000
2. Click "Sign Up" → select "Seller"
3. Go to Dashboard
4. Click "Add Product"
5. Fill in details, set discount & expiry
6. Track sales in dashboard

## Environment Variables

### Server (.env)
\`\`\`
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nearexpiry
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
\`\`\`

### Client (.env)
\`\`\`
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=NearExpiry
\`\`\`

## Production Deployment

### Backend (Heroku/Railway)
\`\`\`bash
# Set environment variables in hosting platform
# Deploy: git push heroku main
\`\`\`

### Frontend (Vercel/Netlify)
\`\`\`bash
cd client
npm run build
# Deploy the 'dist' folder
\`\`\`

## Future Enhancements

- Real payment gateway integration (Stripe/Razorpay)
- Image recognition for expiry date validation
- AI-based pricing recommendations
- Push notifications
- Bulk B2B orders
- Admin dashboard
- Analytics and reporting
- Multi-language support
- Mobile app (React Native)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Contact: support@nearexpiry.com

---

Built with ❤️ to save money and the planet!
