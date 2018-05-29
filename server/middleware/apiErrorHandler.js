const log = require('../config/log')

const { ServerError, ApiError } = require('../errors/apiErrors/apiErrors')
const UnauthorizedError = require('express-jwt').UnauthorizedError

/**
 * Handles API errors. Should be called from the entry file.
 */
module.exports = (err, req, res, next) => {
  
  /**
   * Are we in a production environment
   */
  let inProd = req.app.get('env') === 'production'

  /**
   * Error logging
   */
  let status = err.status || 500;
  if (status >= 500) {
    /**
     * Log 5xx as errors
     */
    log.error(err)
  }
  else if (status >= 400 && process.env.NODE_ENV !== 'production') {
    /**
     * If not in production, log 4xx as warnings
     */
    log.warn(err)
  }

  /**
   * Basic error object to return
   */
  let errorObject = {
    name: err.name,
    message: err.message,
    errors: err.errors || {}
  }

  /**
   * If not in production, add developer error message
   */
  let devError
  if (!inProd) {
    devError = Object.assign({}, errorObject)
  }

  /**
   * Mask error as general server error if error is not one of the following:
   * - ApiError
   * - SyntaxError
   * - UnauthorizedError
   */
  if (
    !(err.constructor.prototype instanceof ApiError) &&
    !(err instanceof SyntaxError) &&
    !(err instanceof UnauthorizedError)
  ) {
    let serverError = new ServerError()
    errorObject = {
      name: serverError.name,
      message: serverError.message,
      errors: {},
    }
  }

  /**
   * Construct error object
   */
  let errRes = errorObject
  errRes._dev = devError

  /**
   * Send error. Set default status code to 500.
   */
  res.status(err.status || 500).json(errRes)
}