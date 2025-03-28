const mongoose = require("mongoose");

const PriceHistorySchema = new mongoose.Schema(
{
  product_id: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  website_id: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Website", 
    required: true 
  },
  price: 
  { type: Number, 
    required: true 
  },
  timestamp: 
  { 
    type: Date, 
    default: Date.now 
  }
});

const priceHistory = mongoose.model("PriceHistory", PriceHistorySchema);

module.exports = priceHistory;