const bunyan = require('bunyan')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const config = reuqire('./config')

const GDPRLog = require('../models/gdprLog')

/**
 * Create Bunyan log stream
 */
const gdprLogStream = require('bunyan-mongodb-stream')({
  model: GDPRLog
})

/**
 * Logs directory
 */
const logsDir = config.logsDir

/**
 * Create logsDir if not already present
 */
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

/**
 * Create logger and add it to the exports
 */
module.exports.log = bunyan.createLogger({
  name: 'elma-core-gdpr',
  streams: [
    {
      level: 'trace',
      path: path.join(logsDir, moment().format('DD-MM-YYYY') + '.log')
    },
    {
      level: 'trace',
      stream: gdprLogStream
    }
  ]
})

/**
 * Report an event to the GDPR log system.
 * 
 * @param {Object} req The current request
 * @param {String} location The location from where the call was made
 * @param {String} message What happened?
 * @param {Object} [user] Mongoose model. The user that the log regards
 * @param {Object} [error] Any potential error that occurred
 */
module.exports.report = (req, location, message, user, error) => {

  let session = null

  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    session = req.headers.authorization.split(' ')[1];
  }

  let ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null)

  module.exports.log.trace({
    user: user,
    location: location,
    error: error,
    caller: _getCallerFile(),
    ip: ip,
    session: session,
  }, message)
}

/**
 * Get calling file. Useful for debugging and very short stack traces.
 */
function _getCallerFile() {
  var originalFunc = Error.prepareStackTrace

  var callerfile
  try {
    var err = new Error()
    var currentfile

    Error.prepareStackTrace = function (err, stack) { return stack }

    currentfile = err.stack.shift().getFileName()

    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName()

      if (currentfile !== callerfile) break
    }
  } catch (e) { }

  Error.prepareStackTrace = originalFunc

  return callerfile
}
