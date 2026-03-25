// ─── models/Booking.js ───
// MongoDB Booking schema for SHAGUN Wedding Planners

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    trim: true
  },
  userEmail: {
    type: String,
    trim: true
  },
  userPhone: {
    type: String,
    trim: true
  },
  packageName: {
    type: String,
    required: [true, 'Package name is required'],
    enum: ['Silver Package', 'Gold Package', 'Platinum Package', 'Elite Package', 'Custom'],
    default: 'Silver Package'
  },
  packagePrice: {
    type: String
  },
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: [
      'Wedding (Full)', 'Haldi Ceremony', 'Mehendi Night',
      'Reception', 'Engagement', 'Sangeet',
      'Corporate Event', 'Custom'
    ]
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true
  },
  guestCount: {
    type: String,
    default: '100 – 200'
  },
  budget: {
    type: String,
    required: [true, 'Budget is required']
  },
  specialRequests: {
    type: String,
    trim: true,
    maxlength: [1000, 'Special requests cannot exceed 1000 characters']
  },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'UPI', 'Card', 'Cash', 'Online'],
    default: 'Bank Transfer'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// ─── Index for faster queries ───
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ date: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
