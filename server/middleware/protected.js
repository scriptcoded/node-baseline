const { UnauthorizedError, NotFoundError } = require('../errors/apiErrors/apiErrors')

/**
 * 
 * 
 * @param {Boolean} allowAdmin     Allow admin access to page. Defaults to `false`
 * @param {String}  [propName]     What property to look for to find the user ID
 * @param {String}  [propLocation] Where to find the property
 */
module.exports = (allowAdmin = false, propName = 'id', propLocation = 'params') => (req, res, next) => {

  // If no user is logged in, deny them
  if (!req.auth.user || !req.auth.user.id) {
    throw new UnauthorizedError()
  }

  let userId = req[propLocation][propName]

  // If the current user matches the userId, allow them
  const authorized = userId == req.auth.user.id

  // If admins are allowed and the current user is admin, allow them
  if (allowAdmin && req.auth.user.admin) {
    authorized = true
  }

  // If not authorized, deny them
  if (!authorized) {
    throw new NotFoundError()
  }

  // User is authorized, continue
  next()
}