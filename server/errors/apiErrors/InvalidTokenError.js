module.exports = class InvalidTokenError extends require('./ApiError') {
  constructor (message) {
    super(message || 'Invalid token', 404)
  }
}