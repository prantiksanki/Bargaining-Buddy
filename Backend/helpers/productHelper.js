const Product = require("../models/product");

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("lowest_price_site", "name url");
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("lowest_price_site", "name url");
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
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
