const { body, param, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
const mongoose = require('mongoose')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const fx = require('mkdir-recursive')

const User = require('../models/user')

const log = require('../config/log')
const { send } = require('../helpers/response')
const protected = require('../middleware/protected')
const sendValidationErrors = require('../middleware/sendValidationErrors')
const validId = require('../middleware/validId')

const { NotFoundError, ValidationError, ServerError } = require('../errors/apiErrors/apiErrors')
const FieldError = require('../errors/FieldError')

const avatarDir = path.resolve('./uploads/avatars')

if (!fs.existsSync(avatarDir)) {
  fx.mkdirSync(avatarDir)
}

module.exports.show = [

  protected(true),

  param('id')
    .isLength({ min: 1 }).withMessage({ code: 'required', text: 'ID is required' }),

  sendValidationErrors(),

  validId(),

  (req, res, next) => {

    User.findById(req.params.id, (err, user) => {
      if (err) { return next(err) }

      if (!user) {
        return next(new NotFoundError)
      }

      send(res, 200, user.toJson())
    })

  }
]

module.exports.getAvatar = [

  param('id')
    .isLength({ min: 1 }).withMessage({ code: 'required', text: 'ID is required' }),

  sendValidationErrors(),

  validId(),

  (req, res, next) => {

    User.findById(req.params.id, (err, user) => {
      if (err) { return next(err) }

      if (!user) {
        return next(new NotFoundError)
      }

      res.sendFile(user.avatarPath)
    })
  }
]

module.exports.updateAvatar = [

  sendValidationErrors(),

  (req, res, next) => {

    User.findById(req.params.id, (err, user) => {
      if (err) { return next(err) }

      if (!user) {
        return next(new NotFoundError)
      }

      let form = new formidable.IncomingForm()
      let avatarPath = path.join(avatarDir, user._id.toString())

      form.parse(req, (err, fields, files) => {
        if (!files.avatar) {
          return next(new ValidationError())
        }
      })

      form.on('fileBegin', (name, file) => {
        if (name == 'avatar') {
          switch (file.type) {
            case 'image/jpeg':
              avatarPath += '.jpg'
              break
            case 'image/png':
              avatarPath += '.png'
              break
            default:
              return next(ValidationError())
              break
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
