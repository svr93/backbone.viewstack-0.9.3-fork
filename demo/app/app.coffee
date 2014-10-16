AppRouter = require "./router"

Application =
  initialize: (callback) ->
    FastClick.attach(document.body)
    @router = new AppRouter()
    callback()

    # Remove scroll from demo
    window.addEventListener "touchstart", (e) ->
      e.preventDefault()

module.exports = Application

