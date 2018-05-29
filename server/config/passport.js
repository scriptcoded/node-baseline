const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../models/user')

/**
 * Set up basic local autentication with passport.
 * Uses email as username.
 */
passport.use(new LocalStrategy(
  {
    usernameField: 'email'
  },

  function (email, password, done) {

    /**
     * Find user
     */
    User.findOne({ email: email }, (err, user) => {
      if (err) { return done(err) }

      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        })
      }

      // Return if password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Password is wrong'
        })
      }
      
      // If credentials are correct, return the user object
      return done(null, user)
    })
  }
))
