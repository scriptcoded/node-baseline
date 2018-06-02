const express = require('express')
const router = express.Router()
const debug = require('debug')('elma-core:api')

const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const organisationController = require('../controllers/organisationController')
const metaController = require('../controllers/metaController')

const { NotFoundError } = require('../errors/apiErrors/apiErrors')

/**
 * All routes should be placed within this file.
 * If the file grows to large, feel free to
 * split it into multiple smaller files
 */




/**
 * Any routes except the ones listed in
 * this array will require authentication.
 */
const noAuthRoutes = [
  '/login',
  '/register',
  '/reset',
  '/reset/set',
  '/activate',
  '/activate/resend',
]
/**
 * Same as noAuthRoutes, but with regex
 * expressions istead. Both arrays will be joined.
 */
const noAuthRoutesRegex = [
  /tos/
]

/**
 * Routes are defined within this export.
 */
module.exports = app => {

  /**
   * Below here are all the route definitions.
   * Note that you always should place logic inside controllers.
   * The only exeptions are redirects or other simple methods.
   * If you are dealing with a lot of redirects (or similar),
   * consider writing middleware for that.
   * 
   * If possible, categorize routes after type, as done below.
   */

  /**
   * Dealing with users
   */
  router.get('/users/:id', userController.show)
  router.put('/users/:id/avatar', userController.updateAvatar)
  router.get('/users/:id/avatar', userController.getAvatar)

  /**
   * Password reset for users
   */
  router.post('/reset', authController.sendPasswordLink)
  router.post('/reset/set', authController.resetPassword)

  /**
   * Email verification for users
   */
  router.post('/activate', authController.activateEmail)
  router.post('/activate/resend', authController.resendActivationEmail)

  /**
   * Register (signup) and login
   */
  router.post('/register', authController.register)
  router.post('/login', authController.login)

  /**
   * Serving of terms of service documents
   */
  router.get('/tos/:version?', metaController.tos)
  
  /**
   * Catch all and return 404 if no route matches.
   */
  router.all('*', (req, res) => {
    throw new NotFoundError()
  })



  /**
   * Feel free to add additional routes
   */



  /**
   * Returns the router object and the routes
   * that shouldn't require authentication.
   */
  return {
    router: router,
    noAuthRoutes: noAuthRoutes,
    noAuthRoutesRegex: noAuthRoutesRegex,
  }
}