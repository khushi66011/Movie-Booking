const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const fallbackStore = require('../data/fallbackStore');

// @route   GET /api/movies
// @desc    Get all movies with optional search and genre filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, genre } = req.query;

    // If MongoDB Atlas is connected, use real DB
    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (genre && genre !== 'All') {
        query.genre = { $in: [new RegExp(genre, 'i')] };
      }
      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { language: searchRegex },
          { genre: { $in: [searchRegex] } },
        ];
      }

      const movies = await Movie.find(query).sort({ featured: -1, rating: -1, createdAt: -1 });
      return res.json({
        success: true,
        count: movies.length,
        movies,
      });
    }

    // Fallback in-memory store
    const movies = fallbackStore.getMovies(search, genre);
    return res.json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    // If Mongoose throws, fallback smoothly
    const { search, genre } = req.query;
    const movies = fallbackStore.getMovies(search, genre);
    return res.json({
      success: true,
      count: movies.length,
      movies,
    });
  }
});

// @route   GET /api/movies/:id
// @desc    Get single movie details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const movie = await Movie.findById(req.params.id);
      if (movie) {
        return res.json({ success: true, movie });
      }
    }

    const movie = fallbackStore.getMovieById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    return res.json({
      success: true,
      movie,
    });
  } catch (error) {
    const movie = fallbackStore.getMovieById(req.params.id);
    if (movie) {
      return res.json({ success: true, movie });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve movie details',
    });
  }
});

module.exports = router;
