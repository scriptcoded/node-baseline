module.exports = class ServerError extends require('./ApiError') {
  constructor (message) {
    super(message || 'An unknown error occured', 500)
  }
}