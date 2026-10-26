const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const fallbackStore = require('../data/fallbackStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'imovies_super_secure_jwt_secret_key_2026_cinema_booking_app'
      );

      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = fallbackStore.findUserById(decoded.id);
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists or invalid token',
        });
      }

      next();
    } catch (error) {
      console.error('[Auth Middleware] Verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

module.exports = { protect };
