const { validationResult } = require('express-validator/check')
const validation = require('../helpers/validation')
const { ValidationError } = require('../errors/apiErrors/apiErrors')

module.exports = () => (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(new ValidationError(...validation.spreadErrors(errors.mapped())))
  }

  next()
}