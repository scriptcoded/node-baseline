module.exports.send = (res, status, data = {}) => {
  res.status(status)
  res.json(data)
}