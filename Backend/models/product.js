const mongoose = require("mongoose");

// product details and website reference

const ProductSchema = new mongoose.Schema(
{
  name: 
  { 
    type: String, 
    required: true 
  },
  category: 
  {
    type: String,
    required: true,
  },
  image: 
  {
    type: String,
    default : "xxxxxxxx.jpeg"
  },
  lowest_price: 
  { 
    type: Number,
    required: true, 
  },
  price_history: 
  [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "PriceHistory" 
  }]
}, 
{ timestamps: true }
);

const productSchema = mongoose.model("Product", ProductSchema);

module.exports = productSchema;
