
/**
 * General API error
 */
module.exports = class AppError extends Error {
  constructor (message, status) {
    /**
     * Calling parent constructor of base Error class.
     */
    super(message)

    /**
     * Saving class name in the property of our custom error as a shortcut.
     */
    this.name = this.constructor.name

    // Not used atm.
    // /**
    //  * Error may be silent. Silent error won't be send to the client.
    //  */
    // this.silent = false

    /**
     * Capturing stack trace, excluding constructor call from it.
     */
    Error.captureStackTrace(this, this.constructor)

    /**
     * Default status code, 500
     */
    this.status = status || 500
  }
}
