const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')

require('dotenv').config()


const pool = require('./config/db')

const authRoutes =
  require('./routes/authRoutes')

const memoryRoutes =
  require('./routes/memoryRoutes')


const app = express()


const PORT =
  Number(process.env.PORT) || 5000


const isProduction =
  process.env.NODE_ENV === 'production'


/*
 * Fail early if authentication is not configured.
 */

if (!process.env.JWT_SECRET) {
  throw new Error(
    'JWT_SECRET is required'
  )
}


/*
 * Express should know when it is behind
 * a reverse proxy in production.
 */

if (isProduction) {
  app.set('trust proxy', 1)
}


/*
 * Security headers
 */

app.use(
  helmet({
    contentSecurityPolicy: false
  })
)


/*
 * CORS
 *
 * Development:
 * localhost:5173 is allowed by default.
 *
 * Production:
 * CLIENT_URL must contain your frontend URL.
 */

const configuredOrigins =
  (process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)


const allowedOrigins =
  configuredOrigins.length > 0
    ? configuredOrigins
    : ['http://localhost:5173']


app.use(
  cors({
    origin: (origin, callback) => {

      /*
       * Requests such as curl/Postman do not
       * necessarily contain an Origin header.
       */

      if (!origin) {
        return callback(null, true)
      }


      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true)
      }


      return callback(
        new Error(
          'Origin is not allowed by CORS'
        )
      )
    },

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'OPTIONS'
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ],

    optionsSuccessStatus: 204
  })
)


/*
 * JSON request protection
 */

app.use(
  express.json({
    limit: '1mb'
  })
)


/*
 * URL-encoded request protection
 */

app.use(
  express.urlencoded({
    extended: false,
    limit: '1mb'
  })
)


/*
 * Generated stories
 *
 * KEEPING THIS ROUTE FOR NOW because your existing
 * Stories frontend currently expects the generated
 * video URL directly.
 *
 * We will secure Story delivery in the next pass
 * without breaking the existing player.
 */

app.use(
  '/generated-stories',
  express.static(
    path.join(
      __dirname,
      'generated-stories'
    ),
    {
      maxAge: isProduction
        ? '1h'
        : 0,

      etag: true
    }
  )
)


/*
 * Root endpoint
 */

app.get('/', (req, res) => {
  res.status(200).json({
    message:
      'LifeCaptured API is running'
  })
})


/*
 * Health endpoint
 *
 * Deliberately avoids exposing the database
 * timestamp or internal details.
 */

app.get(
  '/api/health',
  async (req, res) => {

    try {

      await pool.query(
        'SELECT 1'
      )


      return res.status(200).json({
        status: 'ok'
      })

    } catch (error) {

      console.error(
        'Database health check failed:',
        error
      )


      return res.status(503).json({
        status: 'error'
      })
    }
  }
)


/*
 * API routes
 */

app.use(
  '/api/auth',
  authRoutes
)

app.use(
  '/api/memories',
  memoryRoutes
)


/*
 * Unknown API route
 */

app.use(
  '/api/*splat',
  (req, res) => {
    return res.status(404).json({
      message: 'API route not found'
    })
  }
)


/*
 * Global error handler
 */

app.use(
  (error, req, res, next) => {

    console.error(
      'Unhandled server error:',
      error
    )


    if (
      error.message ===
      'Origin is not allowed by CORS'
    ) {
      return res.status(403).json({
        message:
          'Request origin is not allowed'
      })
    }


    if (
      error.code === 'LIMIT_FILE_SIZE'
    ) {
      return res.status(400).json({
        message:
          'Image must be smaller than 10 MB'
      })
    }


    if (
      error.message?.includes(
        'Only JPG, PNG, and WEBP'
      )
    ) {
      return res.status(400).json({
        message: error.message
      })
    }


    return res.status(500).json({
      message:
        'Something went wrong on the server'
    })
  }
)


/*
 * Start server
 */

const server =
  app.listen(
    PORT,
    () => {
      console.log(
        `LifeCaptured server running on port ${PORT}`
      )

      console.log(
        `Environment: ${
          process.env.NODE_ENV ||
          'development'
        }`
      )
    }
  )


/*
 * Graceful shutdown
 */

const shutdown = async (
  signal
) => {

  console.log(
    `${signal} received. Shutting down gracefully...`
  )


  server.close(
    async () => {

      try {

        await pool.end()

        console.log(
          'PostgreSQL pool closed'
        )

        process.exit(0)

      } catch (error) {

        console.error(
          'Error while closing PostgreSQL pool:',
          error
        )

        process.exit(1)
      }
    }
  )
}


process.on(
  'SIGINT',
  () => shutdown('SIGINT')
)


process.on(
  'SIGTERM',
  () => shutdown('SIGTERM')
)