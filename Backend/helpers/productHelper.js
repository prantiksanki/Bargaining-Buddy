// helpers/productHelper.js
const Product = require("../models/product");
const RecentSearch = require("../models/recentSearches"); // Import RecentSearch model

exports.getProductById = async (req, res) => {
   try {
        // This version just fetches from DB, doesn't trigger scrape
     const product = await Product.findById(req.params.id); // Remove populate if not needed here
     if (!product) return res.status(404).json({ message: "Product not found" });
     res.json(product);
   } catch (err) {
        console.error("Error in getProductById:", err);
     if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: "Invalid product ID format" });
        }
     res.status(500).json({ message: "Server Error" });
   }
 };


// --- Updated getRecentSearches ---
exports.getRecentSearches = async (req, res) => {
  try {
    // Fetch the latest 5 recent search entries
    // Sort by searchedAt descending
    const recentSearchEntries = await RecentSearch.find()
      .sort({ searchedAt: -1 })
      .limit(5)
      .populate({ // Populate the referenced product details
          path: 'productId',
          select: 'title image category _id' // Select only needed fields from Product
      });

    // Filter out any entries where productId might be null (if a product was deleted)
    const validRecentSearches = recentSearchEntries.filter(entry => entry.productId);

    // Format the response to match frontend expectation (or adjust frontend later)
    // Frontend expects: { id, query, timestamp }
    // Let's provide: { id (recent search log id), product { id, title, image, category }, searchedAt }
    const formattedSearches = validRecentSearches.map(entry => ({
        logId: entry._id, // ID of the RecentSearch entry itself
        product: {
            id: entry.productId._id,
            title: entry.productId.title,
            image: entry.productId.image,
            category: entry.productId.category
        },
        timestamp: entry.searchedAt // Use the timestamp from the log
    }));

    res.json(formattedSearches);

  } catch (err) {
    console.error('Error fetching recent searches:', err);
    res.status(500).json({ message: 'Server Error fetching recent searches' });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("lowest_price_site", "name url");
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Add a new product
exports.addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: "Error adding product" });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: "Error updating product" });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: "Error deleting product" });
    }
};
  