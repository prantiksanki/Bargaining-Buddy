const Website = require("../models/websites");

// Get all websites
const getAllWebsites = async (req, res) => {
    try {
        const websites = await Website.find();
        res.json(websites);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Add a new website
const addWebsite = async (req, res) => {
    try {
        const newWebsite = new Website(req.body);
        await newWebsite.save();
        res.status(201).json(newWebsite);
    } catch (err) {
        console.error("Error adding website:", err);
        res.status(400).json({ message: "Error adding website" });
    }
};

// Correct Export
module.exports = { getAllWebsites, addWebsite };
