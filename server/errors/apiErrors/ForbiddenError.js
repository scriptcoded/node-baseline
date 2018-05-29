
/**
 * Forbidden resource. Should be used for
 * private pages and such. For unauthorized,
 * see UnauthorizedError.
 */
module.exports = class ForbiddenError extends require('./ApiError') {
  constructor (message) {
    super(message || 'You don\'t have access to this page', 403)
  }
}