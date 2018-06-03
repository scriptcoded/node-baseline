
/**
 * Resource not active. An inactive user or similar.
 */
module.exports = class NotActiveError extends require('./ApiError') {
  constructor (message) {
    super(message || 'This resource is not active', 403)
  }
}
