const { Pool } = require('pg')

require('dotenv').config()

const isProduction =
  process.env.NODE_ENV === 'production'

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),

  /*
   * Keep the pool intentionally modest.
   * This application does not need a huge connection pool.
   */
  max: Number(process.env.DB_POOL_MAX || 10),

  /*
   * Fail instead of hanging forever when PostgreSQL
   * cannot be reached.
   */
  connectionTimeoutMillis: 5000,

  /*
   * Remove idle connections after 30 seconds.
   */
  idleTimeoutMillis: 30000,

  /*
   * Enable TLS only when the deployment environment
   * explicitly asks for it.
   */
  ssl: isProduction && process.env.DB_SSL === 'true'
    ? {
        rejectUnauthorized:
          process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
      }
    : undefined
})


/*
 * PostgreSQL connection event
 */

pool.on('connect', () => {
  console.log('Connected to PostgreSQL')
})


/*
 * Background pool errors must always have
 * a listener.
 */

pool.on('error', (error) => {
  console.error(
    'Unexpected PostgreSQL pool error:',
    error
  )
})


module.exports = pool