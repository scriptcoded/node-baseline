const express = require('express')
const router = express.Router()
const debug = require('debug')('elma-core:api')

const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const organisationController = require('../controllers/organisationController')
const metaController = require('../controllers/metaController')

const { NotFoundError } = require('../errors/apiErrors/apiErrors')

const noAuthRoutes = [
  '/login',
  '/register',
  '/reset',
  '/reset/set',
  '/activate',
  '/activate/resend',
]
const noAuthRoutesRegex = [
  /tos/
]

module.exports = app => {

  router.get('/users/:id', userController.show)
  router.put('/users/:id/avatar', userController.updateAvatar)
  router.get('/users/:id/avatar', userController.getAvatar)

  router.post('/reset', authController.sendPasswordLink)
  router.post('/reset/set', authController.resetPassword)

  router.post('/activate', authController.activateEmail)
  router.post('/activate/resend', authController.resendActivationEmail)

  router.post('/register', authController.register)
  router.post('/login', authController.login)

  router.get('/organisations/:id', organisationController.show)
  router.post('/organisations', organisationController.create)

  router.get('/tos/:version?', metaController.tos)
  

  router.all('*', (req, res) => {
    throw new NotFoundError()
  })


  return {
    router: router,
    noAuthRoutes: noAuthRoutes,
    noAuthRoutesRegex: noAuthRoutesRegex,
  }
}