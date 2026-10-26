const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    language: {
      type: String,
      required: true,
      default: 'Hindi & English',
    },
    duration: {
      type: String,
      required: true,
      default: '2h 35m',
    },
    releaseDate: {
      type: String,
      default: 'Oct 2026',
    },
    posterUrl: {
      type: String,
      required: true,
    },
    bannerUrl: {
      type: String,
    },
    rating: {
      type: Number,
      default: 8.8,
      min: 0,
      max: 10,
    },
    votes: {
      type: String,
      default: '45.2K',
    },
    certificate: {
      type: String,
      default: 'UA 16+',
    },
    hall: {
      type: String,
      default: 'Audi 1 (IMAX 4K Atmos)',
    },
    showtimes: {
      type: [String],
      default: ['10:30 AM', '01:45 PM', '05:15 PM', '08:30 PM', '11:15 PM'],
    },
    pricing: {
      vip: {
        type: Number,
        default: 450, // Indian Rupees (₹)
      },
      standard: {
        type: Number,
        default: 250, // Indian Rupees (₹)
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual index for searching
movieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
