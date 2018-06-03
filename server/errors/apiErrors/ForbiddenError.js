
/**
 * Forbidden resource. Should be used for
 * private pages and such. For unauthorized,
 * see UnauthorizedError.
 *
 * Great explanation of the difference between 401 and 403: https://stackoverflow.com/a/6937030
 */
module.exports = class ForbiddenError extends require('./ApiError') {
  constructor (message) {
    super(message || 'You don\'t have access to this page', 403)
  }
}
