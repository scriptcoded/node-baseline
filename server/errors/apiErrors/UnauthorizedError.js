
/**
 * Unauthorized. It simply means that the user is not
 * authenticated, and the resource requires authentication.
 *
 * Great explanation of the difference between 401 and 403: https://stackoverflow.com/a/6937030
 */
module.exports = class UnauthorizedError extends require('./ApiError') {
  constructor (message) {
    super(message || 'You must be authorized to access this resource', 401)
  }
}
