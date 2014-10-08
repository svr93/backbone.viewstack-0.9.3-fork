do ->
  "use strict"
  isTouch = "ontouchstart" of window

  unless Backbone
    console?.error "Ensure Backbone is included before backbone.viewstack"

  class Backbone.ViewStack extends Backbone.View

    el: "#views"

    # A dictionary of all views that have been created
    views: {}

    # An array of views in the current stack from bottom to top
    stack: []

    # On the first run, we prevent the push mechanic from causing a transition.
    # This is later used to prevent pushes when manually swiping.
    preventPush: true

    initialize: (options) ->
      console?.error "Declare viewpath for views" unless options.viewPath
      @viewPath = options.viewPath

      @headClass = options.headClass or ".view-head"
      @bodyClass = options.bodyClass or ".view-body"

      return this

    # Split camel-cased names, transform to lower case and replace slashes.
    # eg. ProductTable becomes product-table-view
    # eg. Item/Detail becomes item-detail-view
    identify: (string) ->
      string
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .toLowerCase()
        .replace(/\//g,"-") + "-view"

    # If no `el` is defined in options, create a new element and append to the
    # `#views` element. Create the view, hide it and add it to the stack.
    create: (name, View, options = {}) =>
      unless options.el?
        options.el = $("<div class='view' id='#{@identify(name)}' />")
        @$el.append options.el

      view = new View(options)
      view.__head = view.$(@headClass)
      view.__body = view.$(@bodyClass)
      view.$el.hide()
      @views[name] = view

    # Get the view from the dictionary, or create it if it doesn't exist.
    # Decide whether to pop or push the view, and build the stack if its the
    # first run and a stack is declared on the new view being created.
    # If we are popping and there are no views in the stack,
    # add the current view. This occurs when we refresh the browser on a view
    # part way down the stack.
    show: (name, options = {}) ->
      {key} = options

      key ?= name

      if @views[key]?
        nextView = @views[key]
      else
        viewClass = require @viewPath + name
        nextView = @create name, viewClass, options

        if @stack.length is 0 and nextView.stack
          for _name, i in nextView.stack when _name isnt name
            viewClass = require @viewPath + _name
            view = @create _name, viewClass
            view.$el.css zIndex: i + 1
            @stack.push view

      nextView.show?(options)

      prevView = @stack[@stack.length - 1]

      # Assume we're pushing if the new view is already in the stack.
      push = @stack.indexOf(nextView) < 0

      # We're popping if the previous view explicitly declares so.
      if prevView?.stack?.indexOf(name) > -1
        push = false

      if (push and not @preventPush) or @stack.length is 0
        @pushView(nextView)
      else
        @stack = @stack.slice(0, @stack.indexOf(nextView) + 1).concat(prevView)
        # Ensure the view we pop to is underneath in the stack
        @stack.unshift(nextView) if @stack.length is 1
        @popView()

    # Get the last view in the stack, push the new view and activate it.
    pushView: (view) ->
      prevView = @stack[@stack.length - 1]
      @stack.push(view)
      @activateCurrentView(prevView, true)

    # Pop the last view off the stack and activate it.
    popView: ->
      @activateCurrentView(@stack.pop(), false)

    # Perform two transitions synchronously. Get the next view, and get it
    # ready to animate. Remove events from the old view.
    activateCurrentView: (prevView, isPush) ->
      nextView = @stack[@stack.length - 1]

      @cleaup(nextView.$el)

      if @preventPush
        nextView.delegateEvents().$el.show().addClass("active")
        prevView?.$el.hide()
        @preventPush = false

      else if prevView isnt nextView
        prevView.undelegateEvents().hide?()

        # Set appropriate z-index
        prevView.$el.css(zIndex: @stack.length + (if isPush then -1 else 1))
        nextView.$el.css(zIndex: @stack.length)

        # Show the next view
        nextView.$el.show().addClass("active")

        # Remove transitions before setting initial transforms...
        @transitionView nextView, false
        @transitionView prevView, false

        # ... and then set initial transforms
        @transformView prevView, 0, not isPush
        @transformView nextView, @endRatio(isPush), isPush

        window.clearTimeout @transitionInTimeout
        @transitionInTimeout = window.setTimeout (=>

          # Add transitions and set new transforms
          @transitionView nextView, true
          @transitionView prevView, true
          @transformView nextView, 0, not isPush
          @transformView prevView, @endRatio(not isPush), not isPush

          # After the transition has occured, hide
          window.clearTimeout @transitionOutTimeout
          @transitionOutTimeout = window.setTimeout (=>
            nextView.delegateEvents()
            prevView.$el.hide().removeClass("active")
          ), 300
        ), 10

    # Cleanup views if navigating very quickly without harming transitions.
    # These views have already had their events undelegated, so we just need
    # to hide them and remove their active clase.
    cleaup: ($el) ->
      window.clearTimeout @cleanupTimeout
      @cleanupTimeout = window.setTimeout (=>
        @$el.children(".active").not($el).hide().removeClass("active")
      ), 300

    # The ratio at the end of a transtion.
    # When popping, views only move halfway back.
    endRatio: (isPush) ->
      if isPush then 1 else -0.5

    # Touch events for navigation interaction
    events: ->
      events = {}
      events[if isTouch then "touchstart" else "mousedown"] = "onStart"
      events[if isTouch then "touchmove" else "mousemove"] = "onMove"
      events[if isTouch then "touchend" else "mouseup"] = "onEnd"
      events[if isTouch then "touchcancel" else "mouseleave"] = "onEnd"

      return events

    # When we slide from within the first 40 pixels of the screen, we start the
    # view transitions if the stack contains enough views. We stop any CSS
    # transitions on the two views, and ensure that they are visible. We'll
    # also treat the first touch as a move event to start the transitions.
    onStart: (e) ->
      return if @stack.length < 2 or e.target.nodeName.match /INPUT|TEXTAREA/

      _e = if isTouch then e.touches[0] else e

      offset = @$el.offset()

      @hasSlid = false

      if _e.pageX - offset.left < 40
        prevView = @stack[@stack.length - 1]
        nextView = @stack[@stack.length - 2]

        prevView.$el.css zIndex: @stack.length
        nextView.$el.css zIndex: @stack.length - 1

        @slide =
          startX: _e.pageX - offset.left
          startY: _e.pageY
          offset: offset
          prev: prevView
          next: nextView

        @onMove(e)

    # If the slide object exists, calculate the ratio (between 0 and 1) of how
    # far we have moved, and transform the views accordingly. Ensure that we
    # don't slide outside of the bounds. Don't listen anymore when we've gone
    # over 20 pixels vertically.
    onMove: (e) ->
      return if not @slide?

      e.preventDefault() if e.type is "touchmove"

      _e = if isTouch then e.touches[0] else e

      if not @hasSlid
        if Math.abs(_e.pageX - @slide.offset.left - @slide.startX) > 10
          @hasSlid = true
          @slide.prev.undelegateEvents()
          @slide.next.undelegateEvents()
          @transitionView @slide.prev, false
          @transitionView @slide.next, false
          @slide.next.$el.show()
          @slide.prev.$el.show()

        else if Math.abs(_e.pageY - @slide.startY) > 20
          @onEnd()

      if @hasSlid
        e.stopPropagation()

        @slide.ratio =
          Math.min(Math.max(
            (_e.pageX - @slide.offset.left - @slide.startX) / @slide.offset.width
          , 0), 1)

        @transformView(@slide.prev, @slide.ratio, true)
        @transformView(@slide.next, -(1 - @slide.ratio) * 0.5, false)

    # If the slide object exists, remove the transition styles from the current
    # views. We'll pop the current view if we've slid over half of the screen,
    # in which case we need to ensure that the history.back() pops, and the
    # view leaving has the correct classes. Otherwise, we'll make sure the
    # hidden view returns to its transition position and then clear it's
    # position after the transition duration has passed.
    onEnd: (e) ->
      return if not @slide?

      @transitionView @slide.prev, true
      @transitionView @slide.next, true

      if @hasSlid
        e.stopPropagation()
        next = @slide.next
        prev = @slide.prev

        if @slide.ratio > 0.5
          @transformView prev, @endRatio(true), true
          @transformView next, 0, true
          @preventPush = true
          window.clearTimeout @transitionEndTimeout
          @transitionEndTimeout = window.setTimeout (=>
            window.history.back()
          ), 400
        else
          @transformView prev, 0, false
          @transformView next, @endRatio(false), false
          prev.delegateEvents()

      @slide = null

    # Set the transition on the view's head and body.
    transitionView: (view, willTransition) ->
      transition = if willTransition then "all 300ms" else "none"

      view.__head.add(view.__body).css
        "-webkit-transition": transition
        "-moz-transition": transition
        "-ms-transition": transition
        "-o-transition": transition
        "transition": transition

    # Transforms affect the view in several ways. The ratio dictates its
    # position, but also opacity of the view's body if it is pushing, and the
    # view's head if it is popping.
    transformView: (view, ratio, isPush) ->
      if view
        transform = "translate3d(#{ratio * 100}%, 0, 0)"

        view.__body.css
          "-webkit-transform": transform
          "-moz-transform": transform
          "-ms-transform": transform
          "-o-transform": transform
          "transform": transform
          "opacity": if not isPush then 1 + ratio else 1

        view.__head.css
          "opacity": if isPush then 1 - ratio else 1
