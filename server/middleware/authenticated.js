const { UnauthorizedError, ForbiddenError } = require('../errors/apiErrors/apiErrors')

/**
 * 
 * 
 * @param {boolean} matchId If true, matches `req.params.id` against the current user
 * @param {boolean} allowAdmin If true, allows admins to access
 * @param {string} message Optional message passed to potential errors
 */
module.exports = (matchId = false, allowAdmin = false, message) => (req, res, next) => {

  // If no user is logged in, deny them
  if (!req.auth.user || !req.auth.user.id) {
    throw new UnauthorizedError(message)
  }

  // If matchId
  if (matchId) {
    // If the current user matches the userId, allow them
    const authorized = req.params.id == req.auth.user.id

    // If admins are allowed and the current user is admin, allow them
    if (allowAdmin && req.auth.user.admin) {
      authorized = true
    }

    // If not authorized, deny them
    if (!authorized) {
      throw new ForbiddenError(message)
    }
  }

  // User is fine, continue
  next()
}