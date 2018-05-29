const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const log = require('../config/log')

let userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    displayName: String,
    familyName: String,
    givenName: String,
    displayNameLastFirst: String,
  },
  avatarPath: String,
  hash: String,
  salt: String,

  forcedLogout: {
    type: Boolean,
    default: false,
  },

  tosAgreement: {
    agreed: {
      type: Boolean,
      default: false,
    },
    updatedAt: Date,
    version: String,
  },

  active: {
    type: Boolean,
    default: false,
  },

  passwordReset: {
    token: String,
    expires: Date,
  },

  emailVerificationToken: String,

  organisations: [{
    organisation: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation',
    },
    roles: {
      type: Array,
      default: ['student']
    },
  }]
}, {
  timestamps: true
})

userSchema.methods.toJson = function () {
  return {
    id: this._id,
    email: this.email,
    name: {
      displayName: this.name.displayName,
      familyName: this.name.familyName,
      givenName: this.name.givenName,
      displayNameLastFirst: this.name.displayNameLastFirst,
    },
    avatarUrl: `api/v1/users/${this._id}/avatar`,
    active: this.active,
  }
}

userSchema.virtual('avatarUrl', function () {
  return `api/v1/users/${this._id}/avatar`
})

userSchema.methods.updateDisplayNames = function () {
  this.name.displayName = `${this.name.givenName} ${this.name.familyName}`
  this.name.displayNameLastFirst = `${this.name.familyName}, ${this.name.givenName}`
}

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
}

userSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
  return this.hash === hash
}

userSchema.methods.generateJwt = function () {
  var expiry = new Date()
  expiry.setDate(expiry.getDate() + 7)

  return jwt.sign({
    user: this.toJson(),
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.APP_KEY)
}

userSchema.methods.memberOfOrganisation = function (orgId) {
  log.debug(this.organisations)
}

module.exports = mongoose.model('User', userSchema)
