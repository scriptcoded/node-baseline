module.exports = class ValidationError extends require('./ApiError') {
  constructor (message, errors = []) {
    super(message || 'Malformed request', 400)

    this.errors = errors
  }
}