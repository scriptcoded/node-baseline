const { validator } = require('express-validator/check')
const path = require('path')

/**
 * Custom validators for express-validator
 */
module.exports = app => {
  app.use(validator({
    customValidators: {
      /**
       * File extension is .pdf
       */
      isPDF: function (value, filename) {
        var extension = (path.extname(filename)).toLowerCase()
        return extension === '.pdf'
      }
    }
  }))
}
