module.exports = class TOSNotAcceptedError extends require('./ApiError') {
  constructor (message) {
    super(message || 'Terms of service not accepted', 403)
  }
}