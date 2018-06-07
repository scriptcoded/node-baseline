/**
 * Load environment variables.
 * This will not happen in production, since environment
 * variables should truly be in environment variables
 */
if (process.env.NODE_ENV !== 'production') {
  // Check that the .env file holds all variables defined in .env.example
  require('./server/helpers/validateEnv').validateEnv()
  require('dotenv').load()
}

/**
 * Load server config
 */
const config = require('./server/config/config')

/**
 * Load database and passport config
 */
require('./server/config/database')
require('./server/config/passport')
/**
 * Set global timezone
 */
process.env.TZ = config.timezone

/**
 * Get dependencies
 */
const express = require('express')
const path = require('path')
const http = require('http')
const bodyParser = require('body-parser')
const log = require('./server/config/log')
const morgan = require('morgan')
const fs = require('fs')
const mongoose = require('mongoose')
const urlJoin = require('url-join')
const jwt = require('express-jwt')

/**
 * Mongoose promise error fix
 */
mongoose.Promise = global.Promise

const apiErrorHandler = require('./server/middleware/apiErrorHandler')
const requireTos = require('./server/middleware/requireTos')
const forcedLogout = require('./server/middleware/forcedLogout')

/**
 * Load necessary errors
 */
const { NotFoundError } = require('./server/errors/apiErrors/apiErrors')

/**
 * Initalize the actual express app
 */
const app = express()

/**
 * Unless we are in a test environment, enable access logs
 */
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
  app.use(morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, 'server/logs/access.log'), { flags: 'a' })
  }))
}

/**
 * Set base API url. Should correspond to the current version, e.g. '/api/v1'
 */
const apiUrl = '/api/v1'

/**
 * Get our API routes
 */
const api = require('./server/routes/api')(app)

/**
 * Routes that should not have any type of authentication.
 *
 * Joins the following:
 * - api.noAuthRoutes (also prepends apiUrl)
 * - api.noAuthRoutesRegex
 * - Regex to match anything outside /api. Ensures that frontend routes have no authentication.
 */
const noAuthRoutes = [].concat(
  api.noAuthRoutes.map(route => {
    return urlJoin(apiUrl, route)
  }),
  api.noAuthRoutesRegex,
  [
    /^(?!\/api.*$).*/i
  ]
)

/**
 * Initialize passport
 */
const passport = require('passport')
app.use(passport.initialize())

/**
 * Parsers for POST data
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/**
 * Serve static email content
 */
app.use('/email/static', express.static(path.join(__dirname, 'email/static')))
app.use('/email/static/*', (req, res, next) => {
  next(new NotFoundError())
})

/**
 * Point static path to dist (frontend library)
 */
app.use(express.static(path.join(__dirname, 'dist')))

/**
 * Set up authorization and exclude routes
 */
app.use(jwt({
  secret: process.env.APP_KEY,
  requestProperty: 'auth'
}).unless({
  path: noAuthRoutes
}))

/**
 * Enable forced logout. Won't force logout on routes defined here.
 */
app.use(forcedLogout([].concat(
  noAuthRoutes
)))

/**
 * Require acceptance of Terms of Service. Won't lock on routes defined here.
 */
app.use(requireTos([].concat(
  noAuthRoutes
)))

/**
 * TODO:
 * Implement fallback for /api without version.
 * Should list all avaiable versions.
 */

/**
 * Set our API routes
 */
app.use(apiUrl, api.router)

/**
 *  Catch all other routes and return the index file
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
})

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000'
app.set('port', port)

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`))

/**
 * As a final fallback, if there is an unhandled rejection, log it.
 */
process.on('unhandledRejection', err => {
  log.error('Unhandled rejection: ' + err)
})

/**
 * Catch all errors and return proper JSON responses
 */
app.use(apiErrorHandler)

/**
 * Catch any remaining errors. These won't actually
 * leak out of `apiErrorHandler`, but assuming there
 * is an error in `apiErrorHandler`, we must catch
 * those to prevent `bodyParser` from doing so for us.
 */
// app.use((err, req, res, next) => {
//   log.error('Unhandled error [fallback]: ' + err)
// })

module.exports = app
