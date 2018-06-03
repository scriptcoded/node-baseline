const bunyan = require('bunyan')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const shell = require('shelljs')
const config = require('./config')

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
  shell.mkdir('-p', logsDir)
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
    session = req.headers.authorization.split(' ')[1]
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
    session: session
  }, message)
}

/**
 * Get calling file. Useful for debugging and very short stack traces.
 */
function _getCallerFile () {
  var originalFunc = Error.prepareStackTrace

  var callerfile
  try {
    var thisErr = new Error()
    var currentfile

    Error.prepareStackTrace = function (err, stack) {
      if (err) { }
      return stack
    }

    currentfile = thisErr.stack.shift().getFileName()

    while (thisErr.stack.length) {
      callerfile = thisErr.stack.shift().getFileName()

      if (currentfile !== callerfile) break
    }
  } catch (e) { }

  Error.prepareStackTrace = originalFunc

  return callerfile
}
