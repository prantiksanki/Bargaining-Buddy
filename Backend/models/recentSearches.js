// models/recentSearches.js
const mongoose = require("mongoose");

const recentSearchSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", 
    required: true,
  },
  searchedAt: {
    type: Date,
    default: Date.now,
    index: true, 
  },
});


recentSearchSchema.pre('save', async function(next) {
    const count = await mongoose.model('RecentSearch').countDocuments();
    // Define a limit, e.g., 1000 recent searches globally stored
    const limit = 20;
    if (count >= limit) {
        // Find the oldest entry and remove it
        const oldest = await mongoose.model('RecentSearch').findOne().sort({ searchedAt: 1 });
        if (oldest) {
            await mongoose.model('RecentSearch').deleteOne({ _id: oldest._id });
        }
    }
    next();
});


module.exports = mongoose.model("RecentSearch", recentSearchSchema);