const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
