const { MethodNotAllowedError } = require('../errors/apiErrors/apiErrors')

module.exports = () => (req, res, next) => {
  if (req.allowedMethods != null) {
    if (req.allowedMethods !== [] && !req.allowedMethods.includes(req.method)) {
      let methodsString = req.allowedMethods.join(', ')

      res.set('Access-Control-Allow-Methods', methodsString)

      return next(new MethodNotAllowedError())
    }
  }

  next()
}
