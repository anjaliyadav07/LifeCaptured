const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')


const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/


const MIN_PASSWORD_LENGTH = 6
const MAX_PASSWORD_LENGTH = 128
const MAX_NAME_LENGTH = 100
const MAX_EMAIL_LENGTH = 254


const registerUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password
    } = req.body


    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        message:
          'Name, email, and password are required'
      })
    }


    const cleanName = name.trim()
    const normalizedEmail =
      email.trim().toLowerCase()


    if (!cleanName) {
      return res.status(400).json({
        message: 'Name cannot be empty'
      })
    }


    if (cleanName.length > MAX_NAME_LENGTH) {
      return res.status(400).json({
        message:
          'Name must be 100 characters or fewer'
      })
    }


    if (
      !normalizedEmail ||
      normalizedEmail.length > MAX_EMAIL_LENGTH ||
      !EMAIL_PATTERN.test(normalizedEmail)
    ) {
      return res.status(400).json({
        message: 'Please provide a valid email address'
      })
    }


    if (
      password.length < MIN_PASSWORD_LENGTH
    ) {
      return res.status(400).json({
        message:
          'Password must be at least 6 characters long'
      })
    }


    if (
      password.length > MAX_PASSWORD_LENGTH
    ) {
      return res.status(400).json({
        message:
          'Password must be 128 characters or fewer'
      })
    }


    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1
      `,
      [normalizedEmail]
    )


    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message:
          'An account with this email already exists'
      })
    }


    const hashedPassword =
      await bcrypt.hash(password, 12)


    const result = await pool.query(
      `
      INSERT INTO users (
        name,
        email,
        password
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        name,
        email,
        created_at
      `,
      [
        cleanName,
        normalizedEmail,
        hashedPassword
      ]
    )


    return res.status(201).json({
      message:
        'Account created successfully',
      user: result.rows[0]
    })

  } catch (error) {

    console.error(
      'Register error:',
      error
    )


    return res.status(500).json({
      message:
        'Something went wrong while creating the account'
    })
  }
}


const loginUser = async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body


    if (
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        message:
          'Email and password are required'
      })
    }


    const normalizedEmail =
      email.trim().toLowerCase()


    if (
      !normalizedEmail ||
      normalizedEmail.length > MAX_EMAIL_LENGTH ||
      !EMAIL_PATTERN.test(normalizedEmail)
    ) {
      return res.status(400).json({
        message:
          'Please provide a valid email address'
      })
    }


    if (
      password.length < MIN_PASSWORD_LENGTH ||
      password.length > MAX_PASSWORD_LENGTH
    ) {
      return res.status(401).json({
        message:
          'Invalid email or password'
      })
    }


    if (!process.env.JWT_SECRET) {
      console.error(
        'JWT_SECRET is not configured'
      )

      return res.status(500).json({
        message:
          'Authentication service is not configured'
      })
    }


    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        password
      FROM users
      WHERE email = $1
      `,
      [normalizedEmail]
    )


    if (result.rows.length === 0) {
      return res.status(401).json({
        message:
          'Invalid email or password'
      })
    }


    const user = result.rows[0]


    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      )


    if (!passwordMatches) {
      return res.status(401).json({
        message:
          'Invalid email or password'
      })
    }


    const token = jwt.sign(
      {
        userId: user.id
      },
      process.env.JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: '7d'
      }
    )


    return res.status(200).json({
      message: 'Login successful',

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {

    console.error(
      'Login error:',
      error
    )


    return res.status(500).json({
      message:
        'Something went wrong while logging in'
    })
  }
}


const getCurrentUser = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        created_at
      FROM users
      WHERE id = $1
      `,
      [req.user.userId]
    )


    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found'
      })
    }


    return res.status(200).json({
      user: result.rows[0]
    })

  } catch (error) {

    console.error(
      'Get current user error:',
      error
    )


    return res.status(500).json({
      message:
        'Something went wrong while fetching the user'
    })
  }
}


module.exports = {
  registerUser,
  loginUser,
  getCurrentUser
}