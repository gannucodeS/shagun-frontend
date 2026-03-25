// ============================================================
// routes/bookings.js — Booking Routes for SHAGUN Wedding Planners
// ============================================================

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  bookEvent,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getStats
} = require('../controllers/bookingController');

// ── Client Routes ──────────────────────────────────────────
router.post('/book-event', protect, bookEvent);
router.get('/user-bookings', protect, getUserBookings);

// ── Admin Routes ───────────────────────────────────────────
router.get('/all-bookings', protect, adminOnly, getAllBookings);
router.put('/update-status', protect, adminOnly, updateBookingStatus);
router.delete('/:id', protect, adminOnly, deleteBooking);
router.get('/stats', protect, adminOnly, getStats);

module.exports = router;
