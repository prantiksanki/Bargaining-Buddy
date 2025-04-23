const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  retailer: String,
  price: Number,
  mrp: Number,
  discount: String,
  url: String,
  inStock: Boolean
});

const productSchema = new mongoose.Schema({
  title: String,
  image: String,
  category: String,
  prices: [priceSchema],
  lowestPrice: Number,
  highestPrice: Number,
  averagePrice: Number,
  priceHistory: [
    {
      date: { type: Date, default: Date.now },
      price: Number,
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
