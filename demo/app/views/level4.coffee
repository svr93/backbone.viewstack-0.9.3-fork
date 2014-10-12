app = require("app")

class Level4View extends Backbone.View

  template: require "./templates/level4"

  initialize: ->
    @$el.html(@template())

  show: (options) ->
    # Because the route and transition are equal, we'll cheat and use the
    # transitions name.
    app.router.navigate(options.transition, true)
    @$(".name").html options.transition

    console.log "Show Level 4"

  hide: ->
    console.log "Hide Level 4"

module.exports = Level4View
