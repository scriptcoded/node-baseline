const mongoose = require('mongoose')
const { NotFoundError } = require('../errors/apiErrors/apiErrors')

/**
 * Makes sure that the IDs provided in the query
 * paramaters matches the mongoose format for IDs.
 * 
 * @param {*} params Params to check. Defaults to ['id']
 */
module.exports = (params = ['id']) => (req, res, next) => {
  params.forEach(param => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new NotFoundError)
    }
  })

  next()
}