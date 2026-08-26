const express = require("express");

const {
  register,
  login,
  createAdmin,
  resetAdminPassword,
} = require("../controllers/authController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/create-admin", createAdmin);

// Temporary admin password reset
router.post("/reset-admin-password", resetAdminPassword);

router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    message: "You are authenticated",
    user: req.user,
  });
});

module.exports = router;