app = require("app")

class Level3View extends Backbone.View

  template: require "./templates/level3"
  stack: ["level1", "level2", "level3"]

  initialize: ->
    @$el.html(@template())

  show: ->
    app.router.navigate("level3")
    console.log "Show Level 3"

  hide: ->
    console.log "Hide Level 3"

module.exports = Level3View
