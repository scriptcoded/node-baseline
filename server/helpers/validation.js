const { validationResult } = require('express-validator/check')

module.exports.errorsToText = errors => {
  let errorTexts = []

  for (var key in errors) {
    if (errors[key].msg.text) {
      errorTexts.push(errors[key].msg.text.toLowerCase())
    } else {
      if (typeof errors[key].msg === "string") {
        errorTexts.push(errors[key].msg.toLowerCase())
      }
    }
  }

  let text = errorTexts.join(', ')
  text = `${text[0].toUpperCase()}${text.slice(1)}`

  return text
}

module.exports.spreadErrors = errors => {
  return [
    'Some fields are incorrect: ' + module.exports.errorsToText(errors),
    errors,
  ]
}