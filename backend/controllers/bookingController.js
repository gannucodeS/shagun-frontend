// ─── controllers/bookingController.js ───
// Booking logic for SHAGUN Wedding Planners

const Booking = require('../models/Booking');
const User = require('../models/User');

// ─── POST /api/bookings/book-event ───
// Create a new booking (authenticated clients)
exports.bookEvent = async (req, res) => {
  try {
    const {
      packageName, eventType, date, location,
      guestCount, budget, specialRequests, paymentMethod
    } = req.body;

    // Fetch user details
    const user = await User.findById(req.user.id);

    const booking = await Booking.create({
      userId: req.user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone || '',
      packageName,
      eventType,
      date: new Date(date),
      location,
      guestCount,
      budget,
      specialRequests,
      paymentMethod: paymentMethod || 'Bank Transfer',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully! We will contact you within 24 hours.',
      booking
    });

  } catch (error) {
    console.error('Booking error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─── GET /api/bookings/user-bookings ───
// Get all bookings for the logged-in user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── GET /api/bookings/all-bookings ───
// Admin: Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Filter
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.package) filter.packageName = req.query.package;

    const bookings = await Booking.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      bookings
    });

  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── PUT /api/bookings/update-status ───
// Admin: Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status, notes } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({ success: false, message: 'Booking ID and status are required.' });
    }

    const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status, notes: notes || undefined },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to "${status}".`,
      booking
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── DELETE /api/bookings/:id ───
// Admin: Cancel/delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    res.status(200).json({ success: true, message: 'Booking deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── GET /api/bookings/stats ───
// Admin: Dashboard statistics
exports.getStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    const packageStats = await Booking.aggregate([
      { $group: { _id: '$packageName', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        packageStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
