const mongoose = require("mongoose");

const WebsiteSchema = new mongoose.Schema(
{
  name: 
  { 
    type: String, 
    required: true 
  },
  url: 
  { 
    type: String, 
    required: true 
  },
  logo: 
  {
    type : String,
  }
}, 
{ timestamps: true }
);

const websiteSchema = mongoose.model("Website", WebsiteSchema);

module.exports = websiteSchema;
