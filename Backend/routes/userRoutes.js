const express = require("express");
const router = express.Router();
const userHelper = require("../helpers/userHelper");

// User Routes
router.post("/register", userHelper.registerUser);
router.post("/login", userHelper.loginUser);
router.get("/:id", userHelper.getUserById);

module.exports = router;
