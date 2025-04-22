const mongoose = require('mongoose');

const RecentSearchSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  searchedAt: { type: Date, default: Date.now }
});

const RecentSearch = mongoose.model('RecentSearch', RecentSearchSchema);

module.exports = RecentSearch;