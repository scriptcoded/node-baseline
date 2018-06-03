/* global describe, beforeEach, afterEach,  it */

const sinon = require('sinon')
const request = require('supertest')

const sandbox = sinon.createSandbox()

const app = require('../server')

const User = require('../server/models/user')

const apiUrl = '/api/v1/'

const testHelper = require('../server/helpers/test')
const {expectError, expectResponse, logError} = testHelper

describe('Auth controller', () => {
  beforeEach(() => {
    sandbox.stub(User, 'find')
    sandbox.stub(User, 'findOne')
    sandbox.stub(User, 'findById')

    sandbox.stub(User.prototype, 'save')
  })

  afterEach(() => {
    User.find.restore()
    User.findOne.restore()
    User.findById.restore()

    User.prototype.save.restore()
  })

  describe('Login', () => {
    it('Responds with 200 on correct credentials', done => {
      let user = testHelper.mockUser()

      User.findOne.yields(null, user)

      request(app)
        .post(apiUrl + 'login')
        .type('json')
        .send({ email: user.email, password: user._pwd })
        .expect(200, done)
    })

    it('Responds with token on correct credentials', done => {
      let user = testHelper.mockUser()

      User.findOne.yields(null, user)

      request(app)
        .post(apiUrl + 'login')
        .type('json')
        .send({ email: user.email, password: user._pwd })
        .end((err, res) => {
          logError(err, res)

          expectResponse(res.body, '$.token')

          done()
        })
    })

    it('Responds with 404 on invalid password', done => {
      let user = testHelper.mockUser()

      User.findOne.yields(null, user)

      request(app)
        .post(apiUrl + 'login')
        .type('json')
        .send({ email: user.email, password: 'bar' })
        .expect(404, done)
    })

    it('Responds with 404 on unknown user', done => {
      let user = testHelper.mockUser()

      User.findOne.yields(null, user)

      request(app)
        .post(apiUrl + 'login')
        .type('json')
        .send({ email: 'foo@bar.com', password: 'bar' })
        .expect(404, done)
    })

    it('Responds with 400 on empty email', done => {
      request(app)
        .post(apiUrl + 'login')
        .type('json')
        .send({ password: 'bar' })
        .expect(400, done)
    })

    it('Responds with 400 on invalid email', done => {
      request(app)
        .post(apiUrl + 'login')
        .type('json')
        .send({ email: 'foo', password: 'bar' })
        .expect(400, done)
    })

    it('Responds with 400 on empty password', done => {
      User.findOne.yields()

      request(app)
        .post(apiUrl + 'login')
        .type('json')
        .send({ email: 'foo@example.com' })
        .expect(400, done)
    })

    it('Responds with error on empty password', done => {
      User.findOne.yields()

      request(app)
        .post(apiUrl + 'login')
        .type('json')
        .send({ email: 'foo@example.com' })
        .end((err, res) => {
          logError(err, res)

          let resJson = JSON.parse(res.error.text)

          expectError(resJson, 'password', 'required')

          done()
        })
    })
  })

  describe('Register', () => {
    it('Creates a user - TEST NOT IMPLEMENTED', done => {
      done()
    })
  })
})
