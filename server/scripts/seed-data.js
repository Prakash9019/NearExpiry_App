import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "../models/User.js"
import Product from "../models/Product.js"

dotenv.config()

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nearexpiry")
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Product.deleteMany({})
    console.log("Cleared existing data")

    // Create sample sellers
    const seller1 = await User.create({
      name: "Freshmart Supplies",
      email: "seller1@nearexpiry.com",
      password: "password123",
      role: "seller",
      phone: "9876543210",
      isVerified: true,
    })

    const seller2 = await User.create({
      name: "EcoCare Wholesalers",
      email: "seller2@nearexpiry.com",
      password: "password123",
      role: "seller",
      phone: "9876543211",
      isVerified: true,
    })

    console.log("Created sellers")

    // Create sample products
    const products = [
      {
        seller: seller1._id,
        name: "Dove Organic Soap 100g",
        category: "soap",
        description: "Pure and gentle organic soap bar",
        originalPrice: 150,
        discountPercentage: 40,
        quantity: 150,
        expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
        images: [],
      },
      {
        seller: seller1._id,
        name: "Colgate Toothpaste 100ml",
        category: "toothpaste",
        description: "Fluoride toothpaste for cavity protection",
        originalPrice: 85,
        discountPercentage: 45,
        quantity: 200,
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        images: [],
      },
      {
        seller: seller1._id,
        name: "Head & Shoulders Shampoo 250ml",
        category: "shampoo",
        description: "Anti-dandruff shampoo for healthy scalp",
        originalPrice: 220,
        discountPercentage: 50,
        quantity: 100,
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days (Hot Deal)
        images: [],
      },
      {
        seller: seller2._id,
        name: "Ariel Detergent Powder 1kg",
        category: "detergent",
        description: "Powerful laundry detergent powder",
        originalPrice: 280,
        discountPercentage: 35,
        quantity: 120,
        expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days
        images: [],
      },
      {
        seller: seller2._id,
        name: "Lizol Floor Cleaner 500ml",
        category: "cleaner",
        description: "Disinfectant floor cleaner",
        originalPrice: 95,
        discountPercentage: 30,
        quantity: 200,
        expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days
        images: [],
      },
      {
        seller: seller1._id,
        name: "Pampers Baby Wipes 72pcs",
        category: "baby-care",
        description: "Gentle baby wipes for delicate skin",
        originalPrice: 250,
        discountPercentage: 40,
        quantity: 80,
        expiryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days
        images: [],
      },
      {
        seller: seller2._id,
        name: "Maybelline Mascara 8ml",
        category: "cosmetics",
        description: "Long-lasting volumizing mascara",
        originalPrice: 399,
        discountPercentage: 55,
        quantity: 50,
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days (Hot Deal)
        images: [],
      },
      {
        seller: seller1._id,
        name: "Gillette Shaving Gel 195ml",
        category: "grooming",
        description: "Premium shaving gel for smooth shave",
        originalPrice: 185,
        discountPercentage: 38,
        quantity: 110,
        expiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days
        images: [],
      },
      {
        seller: seller2._id,
        name: "Lux Soap Bar 100g (Pack of 3)",
        category: "soap",
        description: "Premium fragrant soap bars",
        originalPrice: 160,
        discountPercentage: 42,
        quantity: 300,
        expiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days (Hot Deal)
        images: [],
      },
      {
        seller: seller1._id,
        name: "Dabur Toothpaste 200g",
        category: "toothpaste",
        description: "Herbal toothpaste with neem",
        originalPrice: 95,
        discountPercentage: 48,
        quantity: 180,
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        images: [],
      },
      {
        seller: seller2._id,
        name: "Sunsilk Shampoo 180ml",
        category: "shampoo",
        description: "Damage repair shampoo",
        originalPrice: 165,
        discountPercentage: 52,
        quantity: 140,
        expiryDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days
        images: [],
      },
      {
        seller: seller1._id,
        name: "Surf Excel Detergent 500g",
        category: "detergent",
        description: "Quick wash detergent powder",
        originalPrice: 150,
        discountPercentage: 33,
        quantity: 250,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        images: [],
      },
      {
        seller: seller2._id,
        name: "Harpic Toilet Cleaner 500ml",
        category: "cleaner",
        description: "Powerful toilet cleaner liquid",
        originalPrice: 120,
        discountPercentage: 28,
        quantity: 160,
        expiryDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days
        images: [],
      },
      {
        seller: seller1._id,
        name: "Johnson Baby Lotion 200ml",
        category: "baby-care",
        description: "Gentle baby lotion for soft skin",
        originalPrice: 230,
        discountPercentage: 36,
        quantity: 95,
        expiryDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days
        images: [],
      },
      {
        seller: seller2._id,
        name: "Lakme Compact Powder 18g",
        category: "cosmetics",
        description: "Long stay compact powder",
        originalPrice: 310,
        discountPercentage: 50,
        quantity: 75,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days (Hot Deal)
        images: [],
      },
    ]

    const createdProducts = await Product.insertMany(products)
    console.log(`Created ${createdProducts.length} products`)

    // Create sample buyers
    const buyer1 = await User.create({
      name: "Rajesh Kumar",
      email: "buyer1@nearexpiry.com",
      password: "password123",
      role: "buyer",
      phone: "9999999999",
      isVerified: true,
    })

    const buyer2 = await User.create({
      name: "Priya Singh",
      email: "buyer2@nearexpiry.com",
      password: "password123",
      role: "buyer",
      phone: "8888888888",
      isVerified: true,
    })

    console.log("Created sample buyers")

    console.log("\n=== SAMPLE DATA CREATED SUCCESSFULLY ===\n")
    console.log("Seller 1 Account:")
    console.log("  Email: seller1@nearexpiry.com")
    console.log("  Password: password123")
    console.log("  Role: Seller\n")

    console.log("Seller 2 Account:")
    console.log("  Email: seller2@nearexpiry.com")
    console.log("  Password: password123")
    console.log("  Role: Seller\n")

    console.log("Buyer 1 Account:")
    console.log("  Email: buyer1@nearexpiry.com")
    console.log("  Password: password123")
    console.log("  Role: Buyer\n")

    console.log("Buyer 2 Account:")
    console.log("  Email: buyer2@nearexpiry.com")
    console.log("  Password: password123")
    console.log("  Role: Buyer\n")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding data:", error)
    process.exit(1)
  }
}

seedData()
