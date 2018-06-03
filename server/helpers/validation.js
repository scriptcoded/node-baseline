/**
 * Stringifies an array of errors. Good for debugging.
 *
 * @param {*} errors An array of errors
 */
module.exports.errorsToText = errors => {
  let errorTexts = []

  /**
   * Stringify each error
   */
  for (var key in errors) {
    /**
     * If error has complex msg, take text only. Else, take msg.
     */
    if (errors[key].msg.text) {
      errorTexts.push(errors[key].msg.text.toLowerCase())
    } else {
      if (typeof errors[key].msg === 'string') {
        errorTexts.push(errors[key].msg.toLowerCase())
      }
    }
  }

  /**
   * Join error texts
   */
  let text = errorTexts.join(', ')
  /**
   * Make first letter uppercase
   */
  text = `${text[0].toUpperCase()}${text.slice(1)}`

  return text
}

/**
 * Returns an array where the first item is
 * a stringified version of the errors. The
 * rest of the array contains the errors. Used
 * in conjunction with ValidationError. See
 * sendValidationErrors.js for an example.
 */
module.exports.spreadErrors = errors => {
  return [
    'Some fields are incorrect: ' + module.exports.errorsToText(errors),
    errors
  ]
}
