const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
{
  name: 
  { 
    type: String, 
    required: true 
  },
  email: 
  { 
    type: String, 
    required: true, 
    unique: true,
  },
  password: 
  { 
    type: String, 
    required: true 
  },
  salt:
  {
    type : String , 
  },
  uid :
  {
    type : String , 
    required : true , 
    unique : true, 
  }, 
  profileImage:
  {
    type: String, 
    default: "xxxxx.jpg" 
  }
}, 
{ timestamps: true }
);

const userSchema = mongoose.model("User", UserSchema);

module.exports = userSchema;
