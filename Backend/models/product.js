const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  retailer: String,
  price: Number,
  mrp: Number,
  discount: String,
  url: String,
  inStock: Boolean,
  _id: false
});

const priceHistorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  price: Number,
  _id: false
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  image: String,
  category: { type: String, index: true },
  xerveLink: { type: String, unique: true, required: true, index: true },
  prices: [priceSchema],
  lowestPrice: Number,
  highestPrice: Number,
  averagePrice: Number,
  lastSeenPrice: Number,
  size: String,
  priceHistory: [priceHistorySchema],
  lastScanAttempt: Date,
  lastScanSuccess: Boolean,
  lastScannedSearch: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

productSchema.index({
    title: 'text',
    category: 'text'
});

module.exports = mongoose.model("Product", productSchema);
