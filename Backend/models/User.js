// ame, mail, password, location, description

// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: "Not specified",
  },
  description: {
    type: String,
    default: "",
  },
}, { timestamps: true });

const user = mongoose.model("User", userSchema);

module.exports = user;