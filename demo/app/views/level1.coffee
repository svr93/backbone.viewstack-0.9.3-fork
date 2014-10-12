app = require("app")

class Level1View extends Backbone.View

  template: require "./templates/level1"

  initialize: ->
    @$el.html(@template())

  show: ->
    app.router.navigate("level1")
    console.log "Show Level 1"

  hide: ->
    console.log "Hide Level 1"

module.exports = Level1View
