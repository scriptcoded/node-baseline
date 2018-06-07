
/**
 * Method not allowed. If this error is thrown,
 * 'Access-Control-Allow-Methods'-header MUST be set.
 */
module.exports = class MethodNotAllowedError extends require('./ApiError') {
  constructor (message) {
    super(message || 'Method not allowed', 405)
  }
}
