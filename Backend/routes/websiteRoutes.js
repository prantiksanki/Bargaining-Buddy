const express = require("express");
const router = express.Router();
const websiteHelper = require("../helpers/websiteHelper");

router.get("/", websiteHelper.getAllWebsites); // Get all websites
router.post("/", websiteHelper.addWebsite); // Add a new website

module.exports = router;