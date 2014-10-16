app = require("app")
viewstack = require("stack")

class Level3View extends Backbone.View

  template: require "./templates/level3"
  stack: ["level1", "level2", "level3"]

  events:
    "click #alert": "openAlert"

  initialize: ->
    @$el.html(@template())

  show: ->
    app.router.navigate("level3")
    console.log "Show Level 3"

  hide: ->
    console.log "Hide Level 3"

  openAlert: ->
    viewstack.show "popups/alert",
      isDialog: true
      key: "alert"
      transition: "zoom"

module.exports = Level3View
