const mongoose = require('mongoose')
const { NotFoundError } = require('../errors/apiErrors/apiErrors')

module.exports = (params = ['id']) => (req, res, next) => {
  params.forEach(param => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new NotFoundError)
    }
  })

  next()
}