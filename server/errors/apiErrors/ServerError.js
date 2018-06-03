
/**
 * 500, internal server error. Should be thrown to mask sensitive errors.
 */
module.exports = class ServerError extends require('./ApiError') {
  constructor (message) {
    super(message || 'An unknown error occured', 500)
  }
}
