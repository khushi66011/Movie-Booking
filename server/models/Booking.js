const mongoose = require('mongoose');

const seatItemSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: true,
      trim: true,
    },
    seatType: {
      type: String,
      enum: ['VIP', 'Standard'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    movieTitle: {
      type: String,
      required: true,
    },
    moviePoster: {
      type: String,
    },
    certificate: {
      type: String,
      default: 'UA 16+',
    },
    hall: {
      type: String,
      default: 'Audi 1 (IMAX 4K Atmos)',
    },
    showDate: {
      type: String,
      required: true,
    },
    showtime: {
      type: String,
      required: true,
    },
    seats: {
      type: [seatItemSchema],
      required: true,
      validate: [val => val.length > 0, 'At least one seat must be selected'],
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    gstRate: {
      type: Number,
      default: 0.18, // 18% GST
    },
    gstAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['CONFIRMED', 'PENDING', 'CANCELLED'],
      default: 'CONFIRMED',
    },
    paymentMethod: {
      type: String,
      default: 'UPI - Instant Pay',
    },
    qrData: {
      type: String,
      required: true,
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
