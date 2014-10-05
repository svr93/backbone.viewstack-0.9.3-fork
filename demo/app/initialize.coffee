app = require "app"

$ ->
  app.initialize ->
    Backbone.history.start()
