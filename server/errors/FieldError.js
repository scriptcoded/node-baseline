
/**
 * General error for fields (validation error)
 */
module.exports = class FieldError extends Error {
  constructor (message) {
    super(message.msg)

    this.message = message || { code: 'unknown', msg: 'Unknown field error' }
  }
}
