const path = require('path')
const fs = require('fs')

const config = require('../config/config')

const { NotFoundError } = require('../errors/apiErrors/apiErrors')

/**
 * Returns the TOS. If `version` paramater is
 * included, that version will be loaded.
 */
module.exports.tos = (req, res, next) => {
  /**
   * TOS version
   */
  let version = req.params.version || config.tosVersion

  /**
   * Make sure that version is in the correct format (x.x)
   */
  if (!version.match(/\d*[0-9]\.\d*[0-9]/)) {
    next(new NotFoundError())
  }

  /**
   * Resolve path to TOS
   */
  let tosPath = path.resolve(path.join('tos/', version + '.md'))

  /**
   * If the TOS does not exist, 404
   */
  if (!fs.existsSync(tosPath)) {
    next(new NotFoundError())
  }

  /**
   * Send the TOS
   */
  res.sendFile(tosPath)
}