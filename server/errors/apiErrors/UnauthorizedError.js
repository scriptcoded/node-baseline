module.exports = class UnauthorizedError extends require('./ApiError') {
  constructor (message) {
    super(message || 'You must be authorized to access this resource', 401)
  }
}