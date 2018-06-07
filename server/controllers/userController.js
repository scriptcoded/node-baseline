const { param } = require('express-validator/check')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const shell = require('shelljs')

const User = require('../models/user')

const { send } = require('../helpers/response')

const protect = require('../middleware/protect')
const sendValidationErrors = require('../middleware/sendValidationErrors')
const validId = require('../middleware/validId')
const limitMethods = require('../middleware/limitMethods')

const { NotFoundError, ValidationError } = require('../errors/apiErrors/apiErrors')

const avatarDir = path.resolve('./uploads/avatars')

if (!fs.existsSync(avatarDir)) {
  shell.mkdir('-p', avatarDir)
}

module.exports.show = [

  protect(true),

  limitMethods(),

  param('id')
    .isLength({ min: 1 }).withMessage({ code: 'required', text: 'ID is required' }),

  sendValidationErrors(),

  validId(),

  (req, res, next) => {
    User.findById(req.params.id, (err, user) => {
      if (err) { return next(err) }

      if (!user) {
        return next(new NotFoundError())
      }

      send(res, 200, user.toJson())
    })
  }
]

module.exports.getAvatar = [

  limitMethods(),

  param('id')
    .isLength({ min: 1 }).withMessage({ code: 'required', text: 'ID is required' }),

  sendValidationErrors(),

  validId(),

  (req, res, next) => {
    User.findById(req.params.id, (err, user) => {
      if (err) { return next(err) }

      if (!user) {
        return next(new NotFoundError())
      }

      res.sendFile(user.avatarPath)
    })
  }
]

module.exports.updateAvatar = [

  limitMethods(),

  sendValidationErrors(),

  (req, res, next) => {
    User.findById(req.params.id, (err, user) => {
      if (err) { return next(err) }

      if (!user) {
        return next(new NotFoundError())
      }

      let form = new formidable.IncomingForm()
      let avatarPath = path.join(avatarDir, user._id.toString())

      form.parse(req, (err, fields, files) => {
        if (err) { return next(err) }

        if (!files.avatar) {
          return next(new ValidationError())
        }
      })

      form.on('fileBegin', (name, file) => {
        if (name === 'avatar') {
          switch (file.type) {
            case 'image/jpeg':
              avatarPath += '.jpg'
              break
            case 'image/png':
              avatarPath += '.png'
              break
            default:
              return next(ValidationError())
          }

          file.path = avatarPath
        }
      })

      form.on('file', (name, file) => {
        user.avatarPath = avatarPath
        user.save(err => {
          if (err) { return next(err) }

          send(res, 200, {
            user: user.toJson()
          })
        })
      })
    })
  }
]
