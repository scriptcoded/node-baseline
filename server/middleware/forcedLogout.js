const User = require('../models/user')

const {
  UnauthorizedError
} = require('../errors/apiErrors/apiErrors')

/**
 * Handles forced logout.
 */
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
   * If not authenticated, deny them
   */
  if (!req.auth || !req.auth.user) {
    return next(new UnauthorizedError())
  }

  /**
   * Find logged in user
   */
  User.findById(req.auth.user.id, (err, user) => {
    if (err) { return next(err) }

    /**
     * If no user is found, deny them
     */
    if (!user) {
      return next(new UnauthorizedError())
    }

    /**
     * If the user is flagged for logout, deny them.
     * This flag will be reset upon login.
     */
    if (user.forcedLogout) {
      return next(new UnauthorizedError())
    }

    next()
  })
}
