const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const fallbackStore = require('../data/fallbackStore');
const { protect } = require('../middleware/auth');

// Seat Tier Pricing
const SEAT_PRICING = {
  VIP: 450,      // Rows A, B (₹450)
  Standard: 250, // Rows C, D, E (₹250)
};

// Determine seat type from row letter (Rows A, B are VIP; C, D, E are Standard)
const getSeatType = (seatNumber) => {
  const row = seatNumber.charAt(0).toUpperCase();
  if (row === 'A' || row === 'B') {
    return 'VIP';
  }
  return 'Standard';
};

// @route   GET /api/bookings/occupied-seats
// @desc    Get currently booked/occupied seats for a specific movie, date, and showtime
// @access  Public
router.get('/occupied-seats', async (req, res) => {
  try {
    const { movieId, showDate, showtime } = req.query;

    if (!movieId || !showDate || !showtime) {
      return res.status(400).json({
        success: false,
        message: 'movieId, showDate, and showtime query parameters are required',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const bookings = await Booking.find({
        movie: movieId,
        showDate,
        showtime,
        paymentStatus: 'CONFIRMED',
      }).select('seats.seatNumber');

      const occupiedSeats = [];
      bookings.forEach((booking) => {
        booking.seats.forEach((s) => {
          if (!occupiedSeats.includes(s.seatNumber)) {
            occupiedSeats.push(s.seatNumber);
          }
        });
      });

      return res.json({
        success: true,
        occupiedSeats,
        totalOccupied: occupiedSeats.length,
      });
    }

    // Fallback in-memory
    const occupiedSeats = fallbackStore.getOccupiedSeats(movieId, showDate, showtime);
    return res.json({
      success: true,
      occupiedSeats,
      totalOccupied: occupiedSeats.length,
    });
  } catch (error) {
    const occupiedSeats = fallbackStore.getOccupiedSeats(req.query.movieId, req.query.showDate, req.query.showtime);
    return res.json({
      success: true,
      occupiedSeats,
      totalOccupied: occupiedSeats.length,
    });
  }
});

// @route   POST /api/bookings
// @desc    Create a new movie booking & process payment calculation
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { movieId, showDate, showtime, seats, paymentMethod = 'UPI - Instant Pay' } = req.body;

    if (!movieId || !showDate || !showtime || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking data. Please provide movie, date, showtime, and at least one seat.',
      });
    }

    // Extract seat identifiers
    const requestedSeatNumbers = seats.map((s) =>
      typeof s === 'string' ? s.trim().toUpperCase() : s.seatNumber.trim().toUpperCase()
    );

    // Calculate itemized pricing breakdown
    const formattedSeats = requestedSeatNumbers.map((seatNum) => {
      const type = getSeatType(seatNum);
      const price = SEAT_PRICING[type] || 250;
      return {
        seatNumber: seatNum,
        seatType: type,
        price,
      };
    });

    const subtotal = formattedSeats.reduce((acc, seat) => acc + seat.price, 0);
    const gstRate = 0.18; // 18% GST
    const gstAmount = Math.round(subtotal * gstRate * 100) / 100;
    const totalAmount = Math.round((subtotal + gstAmount) * 100) / 100;

    // Generate unique human-readable Booking ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const bookingId = `IMOV-${randomSuffix}`;

    // If MongoDB Atlas is connected
    if (mongoose.connection.readyState === 1) {
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found' });
      }

      // Check existing bookings for race conditions
      const existingBookings = await Booking.find({
        movie: movieId,
        showDate,
        showtime,
        paymentStatus: 'CONFIRMED',
        'seats.seatNumber': { $in: requestedSeatNumbers },
      });

      if (existingBookings.length > 0) {
        const alreadyTaken = [];
        existingBookings.forEach((b) => {
          b.seats.forEach((s) => {
            if (requestedSeatNumbers.includes(s.seatNumber) && !alreadyTaken.includes(s.seatNumber)) {
              alreadyTaken.push(s.seatNumber);
            }
          });
        });

        return res.status(409).json({
          success: false,
          message: `Seat(s) ${alreadyTaken.join(', ')} were just reserved by another guest. Please pick alternate seats.`,
          occupiedSeats: alreadyTaken,
        });
      }

      const qrData = JSON.stringify({
        bookingId,
        user: req.user.name,
        movie: movie.title,
        date: showDate,
        time: showtime,
        seats: requestedSeatNumbers,
        total: `₹${totalAmount}`,
        status: 'VERIFIED_CONFIRMED',
        issuedAt: new Date().toISOString(),
      });

      const newBooking = await Booking.create({
        bookingId,
        user: req.user._id,
        movie: movie._id,
        movieTitle: movie.title,
        moviePoster: movie.posterUrl,
        certificate: movie.certificate || 'UA 16+',
        hall: movie.hall || 'Audi 1 (IMAX 4K Atmos)',
        showDate,
        showtime,
        seats: formattedSeats,
        subtotal,
        gstRate,
        gstAmount,
        totalAmount,
        paymentStatus: 'CONFIRMED',
        paymentMethod,
        qrData,
        bookedAt: new Date(),
      });

      const populatedBooking = await Booking.findById(newBooking._id)
        .populate('user', 'name email')
        .populate('movie', 'title posterUrl duration language certificate');

      return res.status(201).json({
        success: true,
        message: 'Congratulations! Your ticket has been booked.',
        booking: populatedBooking,
      });
    }

    // Fallback store
    const fallbackMovie = fallbackStore.getMovieById(movieId) || {
      title: 'Blockbuster Film',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      certificate: 'UA 16+',
      hall: 'Audi 1 (IMAX 4K Laser)',
    };

    const qrData = JSON.stringify({
      bookingId,
      user: req.user.name,
      movie: fallbackMovie.title,
      date: showDate,
      time: showtime,
      seats: requestedSeatNumbers,
      total: `₹${totalAmount}`,
      status: 'VERIFIED_CONFIRMED',
      issuedAt: new Date().toISOString(),
    });

    const bookingPayload = {
      bookingId,
      user: req.user._id || req.user.id,
      movie: movieId,
      movieTitle: fallbackMovie.title,
      moviePoster: fallbackMovie.posterUrl,
      certificate: fallbackMovie.certificate || 'UA 16+',
      hall: fallbackMovie.hall || 'Audi 1 (IMAX 4K Atmos)',
      showDate,
      showtime,
      seats: formattedSeats,
      subtotal,
      gstRate,
      gstAmount,
      totalAmount,
      paymentStatus: 'CONFIRMED',
      paymentMethod,
      qrData,
      bookedAt: new Date(),
      userObj: { name: req.user.name, email: req.user.email },
    };

    const createdBooking = fallbackStore.createBooking(bookingPayload);

    return res.status(201).json({
      success: true,
      message: 'Congratulations! Your ticket has been booked.',
      booking: createdBooking,
    });
  } catch (error) {
    console.error('[Create Booking Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error occurred while processing booking',
    });
  }
});

// @route   GET /api/bookings/my-bookings
// @desc    Get booking history for currently logged in user
// @access  Private
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      const bookings = await Booking.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('movie', 'title posterUrl duration language certificate hall');

      return res.json({
        success: true,
        count: bookings.length,
        bookings,
      });
    }

    const bookings = fallbackStore.getBookingsByUser(userId);
    return res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    const userId = req.user._id || req.user.id;
    const bookings = fallbackStore.getBookingsByUser(userId);
    return res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking e-ticket by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const booking = await Booking.findOne({
        $or: [{ _id: req.params.id }, { bookingId: req.params.id }],
      })
        .populate('user', 'name email')
        .populate('movie');

      if (booking) {
        return res.json({ success: true, booking });
      }
    }

    const booking = fallbackStore.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    return res.json({
      success: true,
      booking,
    });
  } catch (error) {
    const booking = fallbackStore.getBookingById(req.params.id);
    if (booking) {
      return res.json({ success: true, booking });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking details',
    });
  }
});

module.exports = router;
