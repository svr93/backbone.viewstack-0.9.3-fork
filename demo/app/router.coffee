class AppRouter extends Backbone.Router

  initialize: ->
    @viewstack = new Backbone.ViewStack
      viewPath: "views/"
      el: "#views"
      isLinear: false
      bodyClass: ".view-body"

    # Example of manually creating a view rather than having it required
    # by the view stack.
    @viewstack.create("level4", (require "views/level4"), {})

  routes:
    "level1":       "level1"
    "level2":       "level2"
    "level3":       "level3"
    "zoom":         "zoom"
    "fade":         "fade"

    "*default":     "level1"

  level1: ->
    @viewstack.show "level1"

  level2: ->
    @viewstack.show "level2"

  level3: ->
    @viewstack.show "level3"

  zoom: ->
    @viewstack.show "level4", transition: "zoom"

  fade: ->
    @viewstack.show "level4", transition: "fade"



module.exports = AppRouter
