AppRouter = require "./router"

Application =
  initialize: (callback) ->
    FastClick.attach(document.body)
    @router = new AppRouter()
    callback()

module.exports = Application

