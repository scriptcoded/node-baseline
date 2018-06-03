
/**
 * All API errors, for easy inclusion
 */

module.exports = {
  ApiError: require('./ApiError'),
  DuplicateError: require('./DuplicateError'),
  ForbiddenError: require('./ForbiddenError'),
  NotFoundError: require('./NotFoundError'),
  ServerError: require('./ServerError'),
  UnauthorizedError: require('./UnauthorizedError'),
  ValidationError: require('./ValidationError'),
  InvalidTokenError: require('./InvalidTokenError'),
  NotActiveError: require('./NotActiveError'),
  TOSNotAcceptedError: require('./TOSNotAcceptedError')
}
