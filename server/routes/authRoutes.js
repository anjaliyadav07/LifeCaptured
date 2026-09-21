const express = require('express')
const {
  rateLimit
} = require('express-rate-limit')


const {
  registerUser,
  loginUser,
  getCurrentUser
} = require('../controllers/authController')


const protect =
  require('../middleware/authMiddleware')


const router = express.Router()


/*
 * Login protection
 *
 * 10 attempts per IP every 15 minutes.
 */

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: 'draft-8',
  legacyHeaders: false,

  message: {
    message:
      'Too many login attempts. Please try again later.'
  }
})


/*
 * Registration protection
 *
 * 5 account-creation attempts per IP
 * every hour.
 */

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,

  standardHeaders: 'draft-8',
  legacyHeaders: false,

  message: {
    message:
      'Too many registration attempts. Please try again later.'
  }
})


router.post(
  '/register',
  registerLimiter,
  registerUser
)


router.post(
  '/login',
  loginLimiter,
  loginUser
)


router.get(
  '/me',
  protect,
  getCurrentUser
)


module.exports = router