AppRouter = require "./router"

Application =
  initialize: (callback) ->
    FastClick.attach(document.body)
    @router = new AppRouter()
    callback()

    # Show README
    if $(window).width() > 680
      $("#readme")
        .html(require("README").__content)
        .parent()
        .addClass("with-readme")
      $("#version").html(require("README").version)

    # Remove scroll from demo
    $("#views").on "touchstart", (e) ->
      e.preventDefault()

module.exports = Application

