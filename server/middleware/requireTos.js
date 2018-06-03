const compare = require('node-version-compare')

const User = require('../models/user')

const config = require('../config/config')

const { TOSNotAcceptedError, ServerError } = require('../errors/apiErrors/apiErrors')

module.exports = excluded => (req, res, next) => {
  /**
   * If current url is in the excluded list, ignore this check
   */
  for (var i in excluded) {
    if (req.url.match(excluded[i])) {
      return next()
    }
  }

  /**
   * Find logged in user
   */
  User.findById(req.auth.user.id, (err, user) => {
    if (err) { return next(err) }

    /**
     * If user doesn't exist, send ServerError
     */
    if (!user) {
      return next(new ServerError())
    }

    /**
     * Check if the user has acceppted the current Terms of Service
     */
    let correctTos = compare(user.tosAgreement.version, config.tosVersion) === 0

    /**
     * If the currently accepted TOS is not correct, throw errror
     */
    if (!correctTos) {
      next(new TOSNotAcceptedError())
    }

    next()
  })
}
