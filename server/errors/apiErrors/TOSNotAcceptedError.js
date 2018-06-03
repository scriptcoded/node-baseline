
/**
 * Terms of service not accepted. Is thrown if the current TOS is not acceped.
 */
module.exports = class TOSNotAcceptedError extends require('./ApiError') {
  constructor (message) {
    super(message || 'Terms of service not accepted', 403)
  }
}
