
/**
 * Helper method for sending consistent responses.
 * Should **always** be used when sending responses.
 * 
 * @param {*} res 
 * @param {*} status 
 * @param {*} data 
 */
module.exports.send = (res, status, data = {}) => {
  res.status(status)
  res.json(data)
}