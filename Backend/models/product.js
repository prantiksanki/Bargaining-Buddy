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
  brand:
  { 
    type: String,
    required: true,

  },
  description: 
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
  lowest_price_site: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Website" 
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
