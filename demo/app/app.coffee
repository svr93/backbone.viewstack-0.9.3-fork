AppRouter = require "./router"

Application =
  initialize: (callback) ->
    window.appRouter = new AppRouter callback

module.exports = Application

