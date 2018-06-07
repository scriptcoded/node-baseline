const passport = require('passport')
const async = require('async')
const crypto = require('crypto')
const compare = require('node-version-compare')
const { sprintf } = require('sprintf-js')

const config = require('../config/config')
const log = require('../config/log')
const { report } = require('../config/gdpr')
const mailer = require('../config/nodemailer')

const { body } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

const { send } = require('../helpers/response')
const email = require('../helpers/email')

const sendValidationErrors = require('../middleware/sendValidationErrors')
const limitMethods = require('../middleware/limitMethods')

const User = require('../models/user')

const {
  ApiError,
  ServerError,
  InvalidTokenError,
  NotActiveError,
  UnauthorizedError
} = require('../errors/apiErrors/apiErrors')

const FieldError = require('../errors/FieldError')

/**
 * Register new user
 */
module.exports.register = [

  limitMethods(),

  /**
   * Validate email
   */
  body('email')
    .isLength({ min: 1 }).withMessage({ code: 'required', text: 'Email field is required' })
    .isEmail().withMessage({ code: 'mustBeEmail', text: 'Must be an email' })
    .trim()
    // .normalizeEmail()
    .custom(value => {
      return User.findOne({ email: value }).then(user => {
        if (user) {
          throw new FieldError({ code: 'unavailable', text: 'Email already in use' })
        }
      }).catch(err => {
        if (err.constructor.prototype instanceof ApiError || err instanceof FieldError) {
          throw err
        } else {
          log.error(err)
          throw new ServerError()
        }
      })
    }),

  /**
   * Validate given name
   */
  body('givenName')
    .isLength({ min: 1 }).withMessage({ code: 'required', text: 'Given name field is required' })
    .trim(),

  /**
   * Validate family name
   */
  body('familyName')
    .isLength({ min: 1 }).withMessage({ code: 'required', text: 'Family name field is required' })
    .trim(),

  /**
   * Validate password
   */
  body('password')
    .withMessage({ code: 'required', text: 'Password field is required' })
    .isLength({ min: 8 }).withMessage({ code: 'tooShort', text: 'The password must be at least 8 characters long' })
    .matches(/([a-z])/).withMessage({ code: 'includeLowercase', text: 'The password must contain at least one lowercase letter' })
    .matches(/([A-Z])/).withMessage({ code: 'includeUppercase', text: 'The password must contain at least one uppercase letter' })
    .matches(/[^a-zA-Z\s]/).withMessage({ code: 'includeNonAlpha', text: 'The password must contain at least one non-aphabetical character' }),

  /**
   * Validate that the accepted TOS version
   * matches the current TOS version.
   */
  body('tosAcceptedVersion')
    .isLength({ min: 1 }).withMessage({ code: 'required', text: 'Terms of service version is required' })
    .custom(value => {
      return new Promise((resolve, reject) => {
        let tosVersionDiff = compare(value, config.tosVersion)

        if (tosVersionDiff !== 0) {
          reject(new FieldError({
            code: 'invalidTosVersion',
            text: 'Terms of service version must match current version',
            data: {
              currentVersion: config.tosVersion
            }
          }))
        }

        resolve()
      })
    }),

  /**
   * Sanitize email
   */
  sanitizeBody('email')
    .trim(),

  /**
   * Send any validation errors
   */
  sendValidationErrors(),

  (req, res, next) => {
    /**
     * Create new user object
     */
    let user = new User({
      email: req.body.email,
      name: {
        familyName: req.body.familyName,
        givenName: req.body.givenName
      },
      tosAgreement: {
        agreed: true,
        updatedAt: new Date(),
        version: req.body.tosAcceptedVersion
      }
    })

    /**
     * Update user display names
     */
    user.updateDisplayNames()
    /**
     * Set user password
     */
    user.setPassword(req.body.password)

    /**
     * Send email verification email
     */
    async.series(
      [
        done => {
          /**
           * Generate verification token
           */
          crypto.randomBytes(20, function (err, buf) {
            user.emailVerificationToken = buf.toString('hex')
            done(err)
          })
        },
        done => {
          /**
           * Save user and make GDPR log
           */
          user.save(err => {
            report(req, 'register/save', 'Saved user', user)
            done(err)
          })
        },
        done => {
          /**
           * Activation link
           */
          let activationLink = sprintf(config.email.activationLink, req.headers.host, user.email, user.emailVerificationToken)

          /**
           * Send activation email. Uses email helper method.
           */
          email.sendActivationEmail(user, activationLink).then(() => {
            report(req, 'register/sendEmail', 'Sent email', user)
            done(null)
          }).catch(err => {
            done(err)
          })
        }
      ],
      err => {
        if (err) { return next(err) }

        send(res, 201, {
          status: 'success'
        })
      }
    )
  }
]

/**
 * Log in user
 */
module.exports.login = [

  limitMethods(),

  /**
   * Validate email
   */
  body('email')
    .isLength({ min: 1 }).withMessage({ code: 'required', text: 'Email field is required' })
    .isEmail().withMessage({ code: 'mustBeEmail', text: 'Must be an email' })
    .trim(),

  /**
   * Validate password
   */
  body('password')
    .isLength({ min: 1 })
    .withMessage({ code: 'required', text: 'Password field is required' }),

  /**
   * Sanitize email
   */
  sanitizeBody('email')
    .trim(),

  /**
   * Send validation errors
   */
  sendValidationErrors(),

  (req, res, next) => {
    /**
     * Try authenticating user
     */
    passport.authenticate('local', (err, user, info) => {
      let token

      /**
       * In case of passport error, report and return
       */
      if (err) {
        report(req, 'login', 'Passport error', user, err)
        return next(err)
      }

      /**
       * If no user is found, report deny
       */
      if (!user) {
        report(req, 'login', 'User not found', user)
        return next(new UnauthorizedError('Invalid credentials'))
      }

      /**
       * If user has not verified their email, report and deny
       */
      if (!user.active) {
        report(req, 'login', 'User not activated', user)
        return next(new NotActiveError('User not activated, email not verified'))
      }

      /**
       * Report that the user has successfully logged in
       */
      report(req, 'login', 'User logged in')

      /**
       * Waterfall to stay DRY
       */
      async.waterfall([
        callback => {
          /**
           * Force logout user if necessary
           */
          if (user.forcedLogout) {
            user.forcedLogout = false
            user.save(err => {
              callback(err, true)
            })
          } else {
            callback(null, false)
          }
        }
      ], (err, tosWrong) => {
        if (err) { return next(err) }

        /**
         * Generate JWT-token and send
         */
        token = user.generateJwt()
        send(res, 200, {
          token: token
        })
      })
    })(req, res)
  }
]

/**
 * Send password reset link
 */
module.exports.sendPasswordLink = [

  limitMethods(),

  /**
   * Validate email
   */
  body('email')
    .isLength({ min: 1 }).withMessage({ code: 'required', text: 'Email is required' }),

  /**
   * Send validation errors
   */
  sendValidationErrors(),

  (req, res, next) => {
    /**
     * This waterfall should probably change.
     * There is no need to generate the token
     * if the user doesn't exist.
     */
    async.waterfall([
      (done) => {
        /**
         * Generate password reset token
         */
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex')
          done(err, token)
        })
      },
      (token, done) => {
        /**
         * Find user
         */
        User.findOne({ email: req.body.email }, function (err, user) {
          if (err) { return done(err) }

          /**
           * If no user, return silently
           */
          if (!user) { return done(null, null, null) }

          /**
           * Set user password reset token
           */
          user.passwordReset.token = token
          user.passwordReset.expires = Date.now() + 3600000 // 1 hour

          /**
           * Save user
           */
          user.save(function (err) {
            report(req, 'sendPasswordLink/save', 'Saved user', user)
            done(err, token, user)
          })
        })
      },
      (token, user, done) => {
        /**
         * If a user was found, send email
         */
        if (user) {
          /**
           * Get email template and send email.
           */
          email.getTemplate('password/reset', {
            name: user.name.givenName,
            resetLink: sprintf(config.email.resetPasswordLink, req.headers.host, user.email, token),
            contactEmail: 'test@example.com',
            contactWebsite: 'https://example.com/',
            contactWebsitePretty: 'example.com'
          }).then(message => {
            var mailOptions = {
              to: user.email,
              subject: 'Test återställ lösenord',
              html: message
            }
            mailer.transporter.sendMail(mailOptions, function (err) {
              done(err)
            })
          }).catch(err => {
            done(err)
          })
        } else {
          done(null)
        }
      }
    ], err => {
      if (err) return next(err)

      send(res, 200, {
        status: 'success'
      })
    })
  }
]

/**
 * Reset password
 */
module.exports.resetPassword = [

  limitMethods(),

  /**
   * Validate email
   */
  body('email')
    .isLength({ min: 1 }).withMessage({ code: 'required', text: 'Email is required' }),

  /**
   * Validate token (only existance)
   */
  body('token')
    .isLength({ min: 1 }).withMessage({ code: 'required', text: 'Token is required' }),

  /**
   * Validate new password
   */
  body('password')
    .withMessage({ code: 'required', text: 'Password field is required' })
    .isLength({ min: 8 }).withMessage({ code: 'tooShort', text: 'The password must be at least 8 characters long' })
    .matches(/([a-z])/).withMessage({ code: 'includeLowercase', text: 'The password must contain at least one lowercase letter' })
    .matches(/([A-Z])/).withMessage({ code: 'includeUppercase', text: 'The password must contain at least one uppercase letter' })
    .matches(/[^a-zA-Z\s]/).withMessage({ code: 'includeNonAlpha', text: 'The password must contain at least one non-aphabetical character' }),

  /**
   * Send validation errors
   */
  sendValidationErrors(),

  (req, res, next) => {
    /**
     * Find user with valid token
     */
    User.findOne({
      email: req.body.email,
      'passwordReset.token': req.body.token,
      'passwordReset.expires': { $gte: new Date() }
    }, (err, user) => {
      if (err) { return next(err) }

      /**
       * If no user is found, deny them
       */
      if (!user) {
        return next(new InvalidTokenError())
      }

      /**
       * Remove password reset token and set new password
       */
      user.passwordReset = undefined
      user.setPassword(req.body.password)

      /**
       * Save user
       */
      user.save(err => {
        if (err) { return next(err) }

        report(req, 'resetPassword/save', 'Saved user', user)
        send(res, 200, {
          status: 'success'
        })
      })
    })
  }
]

/**
 * Activate email
 */
module.exports.activateEmail = [

  limitMethods(),

  /**
   * Validate email
   */
  body('email')
    .isLength({ min: 1 }).withMessage({ code: 'required', text: 'Email is required' }),

  /**
   * Validate token (only existance)
   */
  body('token')
    .isLength({ min: 1 }).withMessage({ code: 'required', text: 'Token is required' }),

  /**
   * Send validation errors
   */
  sendValidationErrors(),

  (req, res, next) => {
    /**
     * Find user with matching token
     */
    User.findOne({
      email: req.body.email,
      emailVerificationToken: req.body.token
    }, (err, user) => {
      if (err) { return next(err) }

      /**
       * If no user is found, deny them
       */
      if (!user) {
        return next(new InvalidTokenError())
      }

      /**
       * Remove emial verification token and activate user
       */
      user.emailVerificationToken = undefined
      user.active = true

      /**
       * Save user
       */
      user.save(err => {
        if (err) { return next(err) }

        report(req, 'resetPassword/save', 'Saved user', user)
        send(res, 200, {
          status: 'success'
        })
      })
    })
  }
]

/**
 * Resend activation email
 */
module.exports.resendActivationEmail = [

  limitMethods(),

  /**
   * Validate email
   */
  body('email')
    .isLength({ min: 1 }).withMessage({ code: 'required', text: 'Email is required' }),

  /**
   * Send validation errors
   */
  sendValidationErrors(),

  (req, res, next) => {
    async.waterfall(
      [
        (done) => {
          /**
           * Find user
           */
          User.findOne({
            email: req.body.email
          }, (err, user) => {
            if (err) { return done(err) }

            // /**
            //  * If no user is found, deny them
            //  */
            // if (!user) {
            //   return done(new NotFoundError('User not found'))
            // }

            // /**
            //  * If user is already activated, deny them
            //  */
            // if (user.active) {
            //   return done(new ApiError('User already active'))
            // }

            /**
             * If no user, return silently
             */
            if (!user) { return done(null, null) }

            /**
             * If user already active, return silently
             */
            if (user.active) { return done(null, null) }

            done(null, user)
          })
        },
        (user, done) => {
          if (!user) { return done(null, null) }

          /**
           * Generate verification token
           */
          crypto.randomBytes(20, function (err, buf) {
            user.emailVerificationToken = buf.toString('hex')
            done(err, user)
          })
        },
        (user, done) => {
          if (!user) { return done(null, null) }

          /**
           * Save user
           */
          user.save(err => {
            done(err, user)
          })
        },
        (user, done) => {
          if (!user) { return done(null, null) }

          /**
           * Activation link
           */
          let activationLink = `http://${req.headers.host}/activate/${user.email}/${user.emailVerificationToken}`

          /**
           * Send activation email
           */
          email.sendActivationEmail(user, activationLink).then(() => {
            done(null)
          }).catch(err => {
            done(err)
          })
        }
      ],
      err => {
        if (err) {
          log.warn(err)
        }

        send(res, 201, {
          status: 'success'
        })
      }
    )
  }
]
