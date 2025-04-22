const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Import Routes
const productRoutes = require("./routes/productRoutes");
const priceHistoryRoutes = require("./routes/priceHistoryRoutes");
const scraperRoutes = require("./routes/scraperRoutes.js");  

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Routes
app.use("/products", productRoutes);
app.use("/price-history", priceHistoryRoutes);
app.use("/", scraperRoutes); // Scraper route
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/bargainbuddy", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => { 
    console.log(`Connected to MongoDB API at ${process.env.MONGO_URI || "mongodb://localhost:27017/bargainbuddy"} | ${new Date().toLocaleString()}`);
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to BargainBuddy API 🎉");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
