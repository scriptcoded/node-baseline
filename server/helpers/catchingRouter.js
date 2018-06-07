module.exports = (router) => ({
  post: function (path, ...callbacks) {
    return this._handleRoute(['POST'], path, ...callbacks)
  },
  get: function (path, ...callbacks) {
    return this._handleRoute(['GET'], path, ...callbacks)
  },
  put: function (path, ...callbacks) {
    return this._handleRoute(['PUT'], path, ...callbacks)
  },
  all: function (path, ...callbacks) {
    return this._handleRoute([], path, ...callbacks)
  },

  /**
   * We're not using this, so just "forward" it.
   */
  param: function (...args) {
    return router.param(...args)
  },

  /**
   * We're not using this either. "Forward" it as well.
   */
  use: function (...args) {
    return router.use(...args)
  },

  /**
   * Handle any route, provided certain
methods. Empty array means all routes.
   */
  _handleRoute: function (methods, path, ...callbacks) {
    return router.all(path, this._routeInterceptor(methods), ...callbacks)
  },

  /**
   * Intercepts route and adds allowed methods
   * to request object. Is later validated
   * using limitMethods middleware.
   */
  _routeInterceptor: (methods) => (req, res, next) => {
    req.allowedMethods = methods

    next()
  }
})
