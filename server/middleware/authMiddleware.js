const jwt = require('jsonwebtoken')


const protect = (req, res, next) => {
  try {

    if (!process.env.JWT_SECRET) {
      console.error(
        'JWT_SECRET is not configured'
      )

      return res.status(500).json({
        message: 'Authentication service is not configured'
      })
    }


    const authorizationHeader =
      req.headers.authorization


    if (!authorizationHeader) {
      return res.status(401).json({
        message: 'Authentication required'
      })
    }


    const parts =
      authorizationHeader.trim().split(/\s+/)


    if (
      parts.length !== 2 ||
      parts[0] !== 'Bearer' ||
      !parts[1]
    ) {
      return res.status(401).json({
        message: 'Invalid authentication format'
      })
    }


    const token = parts[1]


    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ['HS256']
      }
    )


    const userId = Number(decoded.userId)


    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(401).json({
        message: 'Invalid authentication token'
      })
    }


    req.user = {
      userId
    }


    next()

  } catch (error) {

    return res.status(401).json({
      message: 'Invalid or expired token'
    })

  }
}


module.exports = protect