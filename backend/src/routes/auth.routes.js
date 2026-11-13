
const express = require("express");
const authController = require("../controllers/auth.controller");
const { authenticateAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

// Initial admin setup
router.post("/setup", authController.setupAdmin);

// Admin login
router.post("/login", authController.login);

// Check currently logged-in admin
router.get("/me", authenticateAdmin, authController.getCurrentAdmin);

// Admin logout
router.post("/logout", authController.logout);

module.exports = router;
