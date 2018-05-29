const bunyan = require('bunyan')
const fs = require('fs')
const path = require('path')
const config = require('./config')

const logsDir = config.logsDir

/**
 * Create logs dir if not present
 */
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

let log

/**
 * Set up logger depending on Node environment
 */
switch (process.env.NODE_ENV) {
  case 'test':
    log = bunyan.createLogger({
      name: 'elma-core',
      streams: [
        {
          level: 'fatal',
          stream: process.stdout
        }
      ]
    })
    break

  case 'development':
    log = bunyan.createLogger({
      name: 'elma-core',
      streams: [
        {
          level: 'trace',
          stream: process.stdout
        },
        {
          level: 'error',
          path: path.join(logsDir, 'errors.log')
        }
      ]
    })
    break

  default:
    log = bunyan.createLogger({
      name: 'elma-core',
      streams: [
        {
          level: 'info',
          stream: process.stdout
        },
        {
          level: 'error',
          path: path.join(logsDir, 'errors.log')
        }
      ]
    })
    break
}

module.exports = log