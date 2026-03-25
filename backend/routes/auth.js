// ============================================================
// routes/auth.js — Authentication Routes for SHAGUN Wedding Planners
// ============================================================

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  signup,
  login,
  getMe,
  updateProfile
} = require('../controllers/authController');

// ── Public Routes ──────────────────────────────────────────
router.post('/signup', signup);
router.post('/login', login);

// ── Protected Routes ───────────────────────────────────────
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
