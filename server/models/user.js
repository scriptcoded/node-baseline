const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

/**
 * Schema for users
 */
let userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    familyName: String,
    givenName: String,
    displayName: String, // Generated by updateDisplayNames method
    displayNameLastFirst: String // Set by updateDisplayNames method
  },
  avatarPath: String, // Path to avatar on server

  hash: String, // Password hash
  salt: String, // Password salt

  forcedLogout: { // Forced logout. This is safe to touch in the database.
    type: Boolean,
    default: false
  },

  tosAgreement: { // Terms of service. This should NEVER be touched.
    agreed: {
      type: Boolean,
      default: false
    },
    updatedAt: Date,
    version: String
  },

  active: { // Whether or not the user email is verified.
    type: Boolean,
    default: false
  },

  passwordReset: { // Password reset. Contains token and expiry date.
    token: String,
    expires: Date
  },

  emailVerificationToken: String // Email verification. No expiry date is necessary.

  /**
   * Below here is space for additional fields.
   * Feel free to add anything you want!
   */

}, {
  timestamps: true
})

/**
 * Converts the user to JSON. Note that the
 * return value of this function should be
 * safe to send to the client. Use this
 * method whenever serializing a user. You
 * must therefore add any added fields that
 * should be available in the frontend here.
 */
userSchema.methods.toJson = function () {
  return {
    id: this._id,
    email: this.email,
    name: {
      familyName: this.name.familyName,
      givenName: this.name.givenName,
      displayName: this.name.displayName,
      displayNameLastFirst: this.name.displayNameLastFirst
    },
    avatarUrl: `api/v1/users/${this._id}/avatar`,
    active: this.active
  }
}

/**
 * Virtual field for public avatar URL.
 * Format should probably be stored in config.
 */
userSchema.virtual('avatarUrl', function () {
  return `api/v1/users/${this._id}/avatar`
})

/**
 * Below here is space for additional virtual fields.
 * Feel free to add anything you want!
 */

/**
 * Updates display names. Should be called
 * whenever givenName or familyName is updated.
 */
userSchema.methods.updateDisplayNames = function () {
  this.name.displayName = `${this.name.givenName} ${this.name.familyName}`
  this.name.displayNameLastFirst = `${this.name.familyName}, ${this.name.givenName}`
}

/**
 * Sets the user password
 *
 * @param String password
 */
userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
}

/**
 * Checks the given password against the user password
 * @param String password
 */
userSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
  return this.hash === hash
}

/**
 * Generates a JWT for authentication. Contains
 * return value of the toJson method of the user
 */
userSchema.methods.generateJwt = function () {
  var expiry = new Date()
  expiry.setDate(expiry.getDate() + 7)

  return jwt.sign({
    user: this.toJson(),
    exp: parseInt(expiry.getTime() / 1000)
  }, process.env.APP_KEY)
}

/**
 * Below here is space for additional methods.
 * Feel free to add anything you want!
 */

module.exports = mongoose.model('User', userSchema)
