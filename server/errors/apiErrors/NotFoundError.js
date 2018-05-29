module.exports = class NotFoundError extends require('./ApiError') {
  constructor (message) {
    super(message || 'Resource not found', 404)
  }
}