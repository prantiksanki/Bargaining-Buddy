import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import User from "./models/User.js";
import nodemailer from "nodemailer";


// Import Routes
import productRoutes from "./routes/productRoutes.js";
import priceHistoryRoutes from "./routes/priceHistoryRoutes.js";
import scraperRoutes from "./routes/scraperRoutes.js";  

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
  const newUser = new User({
    name,
    mail,
    password,
    location,
    description
  });
  newUser.save()
    .then(() => {
      res.redirect("/login");
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
  User.find({ mail, password })
    .then((user) => {
      if (user.length > 0) {
        res.status(200).json({ message: "Login successful", user });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch((err) => {
      console.error("Error logging in:", err);
      res.status(500).json({ error: "Internal server error" });
    });
})


app.post("/alert", async (req, res) => {
  const { email, price, title, currentPrice, link } = req.body;
  console.log("Received data:", { email, price, title, currentPrice, link });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: 'BargainBuddy',
    to: email,
    subject: '🔔 Price Alert Set: We’ll Notify You!',
    html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Price Alert Set</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 0; margin: 0;">
        <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; margin: 40px auto; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding: 20px; background-color: #2980b9; color: white; border-top-left-radius: 10px; border-top-right-radius: 10px;">
              <h2 style="margin: 0;">🔔 Price Alert Set!</h2>
              <p style="margin: 0;">We’ll notify you when your product hits your expected price.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px;">
              <p style="font-size: 16px;">Hi <strong>Bargain Hunter</strong>,</p>
              <p style="font-size: 16px;">Your price alert for the following product has been set on <strong>BargainBuddy</strong>:</p>

              <table style="margin-top: 20px; font-size: 16px; width: 100%;">
                <tr>
                  <td style="padding: 6px 0;"><strong>🛍️ Product:</strong></td>
                  <td style="padding: 6px 0;">${title}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0;"><strong>💰 Current Price:</strong></td>
                  <td style="padding: 6px 0; color: #2980b9;"><strong>₹ ${currentPrice}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0;"><strong>🎯 Your Expected Price:</strong></td>
                  <td style="padding: 6px 0;">₹${price}</td>
                </tr>
              </table>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${link}" target="_blank" style="background-color: #2980b9; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  🔗 View Product
                </a>
              </div>

              <p style="margin-top: 30px;">We’ll keep an eye on the price and notify you as soon as it drops to your expected value.</p>
              <p>Thanks for using <strong>BargainBuddy</strong> to shop smart and save more.</p>

              <p style="margin-top: 20px;">🛒 Happy Bargain Hunting!<br>– The BargainBuddy Team</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f1f1f1; text-align: center; padding: 12px; font-size: 12px; color: #777; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
              © 2025 BargainBuddy · All rights reserved.
            </td>
          </tr>
        </table>
      </body>
      </html>`,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true, message: "Email sent", result });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).send({ success: false, message: "Failed to send email", error });
  }
});



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
app.get("/", (_req, res) => {
  res.send("Welcome to BargainBuddy API 🎉");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
