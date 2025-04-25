const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const user = require("./models/User.js");


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




app.post("/signup", (req, res) => {
  const {name, mail, password, location, description } = req.body;
  console.log("Received data:", { name, mail, password, location, description });
  const newUser = new user({
    name,
    mail,
    password,
    location,
    description
  });
  newUser.save()
    .then(() => {
      res.status(201).json({ message: "User created successfully" });
    })
    .catch((err) => {
      console.error("Error creating user:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});  

app.post("/login" , (req,res) =>
{
  const { mail, password } = req.body;
  console.log("Received data:", { mail, password });
  user.find({ mail, password })
    .then((user) => {
      if (user.length > 0) {
        res.status(200).json({ message: "Login successful" , user });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch((err) => {
      console.error("Error logging in:", err);
      res.status(500).json({ error: "Internal server error" });
    });
})



// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/bargainbuddy" || process.env.MONGO_URI , {
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
