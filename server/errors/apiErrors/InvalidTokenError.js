
/**
 * Invalid token. E.g. used password reset or similar.
 */
module.exports = class InvalidTokenError extends require('./ApiError') {
  constructor (message) {
    super(message || 'Invalid token', 404)
  }
}