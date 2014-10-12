app = require("app")

class Level2View extends Backbone.View

  template: require "./templates/level2"
  stack: ["level1", "level2"]

  initialize: ->
    @$el.html(@template())

  show: ->
    app.router.navigate("level2", true)
    console.log "Show Level 2"

  hide: ->
    console.log "Hide Level 2"

module.exports = Level2View
