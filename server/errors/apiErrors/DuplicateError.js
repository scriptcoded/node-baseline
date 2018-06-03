/**
 * Duplicate error. Could be used for e.g.already
 * existing to-do or duplicate file uploads.
 */
module.exports = class DuplicateError extends require('./ApiError') {
  constructor (message) {
    super(message || 'Resource already exists', 422)
  }
}
