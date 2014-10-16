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
    $("#views").on "touchmove", (e) ->
      viewBody = $(e.target).parents(".view-body").get(0)
      unless viewBody and viewBody.offsetHeight < viewBody.scrollHeight
        e.preventDefault()

module.exports = Application

