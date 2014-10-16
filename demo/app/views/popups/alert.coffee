app = require("app")
viewstack = require("stack")

class AlertView extends Backbone.View

  template: require "views/templates/popups/alert"

  events:
    "click #close": "exit"
    "click #close-to-level1": "closeToLevel1"

  initialize: ->
    @$el.html(@template())

  show: ->
    console.log "Show Alert"

  hide: ->
    console.log "Hide Alert"

  closeToLevel1: ->
    app.router.navigate("level1", true)


module.exports = AlertView
