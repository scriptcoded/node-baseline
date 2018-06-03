
/**
 * Basic 404, nothing special about that :)
 */
module.exports = class NotFoundError extends require('./ApiError') {
  constructor (message) {
    super(message || 'Resource not found', 404)
  }
}
