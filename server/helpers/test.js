const jp = require('jsonpath')

const User = require('../models/user')

/**
 * Takes a response and makes sure that a specific error exists
 *
 * @param {Object} response The parsed response
 * @param {string} field The field that request validation
 * @param {string} code The code that is expected
 */
module.exports.expectError = (response, field, code) => {
  if (!response.errors) {
    throw new Error('Expected error')
  }
  if (!response.errors[field]) {
    throw new Error('Expected password error')
  }
  if (response.errors[field].msg.code !== code) {
    throw new Error(`Expected password ${code} error`)
  }
}

/**
 * Takes a response and makes sure that a specific item exists
 *
 * @param {Object} response The parsed response
 * @param {string} path The JSON path that should be checked
 * @param {string} value The expected value at the location of the JSON path
 */
module.exports.expectResponse = (response, path, value) => {
  let actual = jp.query(response, path)

  if (!actual.length) {
    throw new Error('JSON path didn\'t match: ' + path)
  }

  if (value !== undefined && actual[0] !== value) {
    throw new Error(`JSON path value didn't match expected value '${value}' @ ${path}`)
  }
}

/**
 * Mocks a user for testing. Raw password is accessed through `_pwd`
 *
 * @param {*} email Defaults to `test[a]example.com`
 * @param {*} password Defaults to `#SuperStrong`
 */
module.exports.mockUser = (email = 'test@example.com', password = '#SuperStrong') => {
  let user = new User({
    email: email
  })

  user._pwd = password

  if (password !== undefined) {
    user.setPassword(password)
  }

  return user
}

module.exports.logError = (err, res) => {
  if (err) {
    // Might require a check for existance of `res.error.text` and throw error
    throw new Error(JSON.parse(res.error.text).message)
  }
}
