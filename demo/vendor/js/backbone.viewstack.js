/* backbone.viewstack - v0.9.1 - MIT */
/* Manage views & transitions in Backbone without the boilerplate */
/* https://github.com/Creative-Licence-Digital/backbone.viewstack */
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function() {
  "use strict";
  var isTouch;
  isTouch = "ontouchstart" in window;
  if (!Backbone) {
    if (typeof console !== "undefined" && console !== null) {
      console.error("Ensure Backbone is included before backbone.viewstack");
    }
  }
  return Backbone.ViewStack = (function(superClass) {
    extend(ViewStack, superClass);

    function ViewStack() {
      return ViewStack.__super__.constructor.apply(this, arguments);
    }

    ViewStack.prototype.defaults = {
      viewPath: "views/",
      headClass: ".view-head",
      bodyClass: ".view-body",
      ms: 300,
      overwrite: true
    };

    ViewStack.prototype.el = "#views";

    ViewStack.prototype.views = {};

    ViewStack.prototype.stack = [];

    ViewStack.prototype.preventTransition = true;

    ViewStack.prototype.willCustomPush = false;

    ViewStack.prototype.initialize = function(options) {
      var key, ref, val;
      ref = _.extend({}, this.defaults, options);
      for (key in ref) {
        val = ref[key];
        this[key] = val;
      }
      if (!this.viewPath) {
        if (typeof console !== "undefined" && console !== null) {
          console.error("Declare viewpath for views");
        }
      }
      if (this.overwrite) {
        this.$el.html("");
      }
      return this;
    };

    ViewStack.prototype.identify = function(string) {
      return string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase().replace(/\//g, "-") + "-view";
    };

    ViewStack.prototype.create = function(name, View, options) {
      var key, view;
      if (options == null) {
        options = {};
      }
      key = options.key || name;
      if (options.el == null) {
        options.el = $("<div class='view' id='" + (this.identify(key)) + "' />");
        this.$el.append(options.el);
      }
      view = new View(options);
      view.__key = key;
      view.__head = view.$(this.headClass);
      view.__body = view.$(this.bodyClass);
      if (view.open == null) {
        view.open = (function(_this) {
          return function(options) {
            return _this.openView(view, options);
          };
        })(this);
      }
      if (view.exit == null) {
        view.exit = (function(_this) {
          return function() {
            return _this.exitView(view);
          };
        })(this);
      }
      view.$el.hide();
      return this.views[key] = view;
    };

    ViewStack.prototype.openView = function(view, options) {
      return this.show(view.__key, options);
    };

    ViewStack.prototype.exitView = function(view) {
      if (this.stack.length > 1 && this.stack[this.stack.length - 1].__key === view.__key) {
        if (this.isLinear) {
          return window.history.back();
        } else {
          return this.show(this.stack[this.stack.length - 2].__key);
        }
      }
    };

    ViewStack.prototype.show = function(name, options) {
      var _name, i, isPush, j, key, len, nextView, prevView, ref, ref1, view, viewClass;
      if (options == null) {
        options = {};
      }
      key = options.key || name;
      if (this.views[key] != null) {
        nextView = this.views[key];
      } else {
        viewClass = require(this.viewPath + name);
        nextView = this.create(name, viewClass, options);
        if (this.stack.length === 0 && nextView.stack) {
          ref = nextView.stack;
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            _name = ref[i];
            if (!(_name !== name)) {
              continue;
            }
            viewClass = require(this.viewPath + _name);
            view = this.create(_name, viewClass);
            view.$el.css({
              zIndex: i + 1
            });
            this.stack.push(view);
          }
        }
      }
      if (typeof nextView.show === "function") {
        nextView.show(options);
      }
      prevView = this.stack[this.stack.length - 1];
      isPush = this.stack.indexOf(nextView) < 0;
      if ((prevView != null ? (ref1 = prevView.stack) != null ? ref1.indexOf(name) : void 0 : void 0) > -1) {
        isPush = false;
      }
      if (options.isDialog) {
        this.willShowDialog = true;
      }
      if (options.transition) {
        this.undelegateEvents();
      } else {
        this.delegateEvents();
      }
      if (options.transition) {
        this.willCustomPush = true;
        this.transform = this[options.transition + "Transform"];
      } else if (!this.willCustomPush) {
        this.willCustomPush = false;
        this.transform = this.slideTransform;
      }
      if (isPush || this.stack.length === 0 && !this.preventTransition) {
        return this.pushView(nextView);
      } else {
        if (this.willShowDialog) {
          prevView = this.removeDialog(nextView) || prevView;
        }
        this.stack = this.stack.slice(0, this.stack.indexOf(nextView) + 1).concat(prevView);
        if (this.stack.length === 1) {
          this.stack.unshift(nextView);
        }
        this.popView();
        this.willHideDialog = false;
        if (!options.transition) {
          return this.willCustomPush = false;
        }
      }
    };

    ViewStack.prototype.pushView = function(view) {
      var prevView;
      prevView = this.stack[this.stack.length - 1];
      this.stack.push(view);
      return this.activateCurrentView(prevView, true);
    };

    ViewStack.prototype.popView = function() {
      return this.activateCurrentView(this.stack.pop(), false);
    };

    ViewStack.prototype.removeDialog = function(nextView) {
      this.willShowDialog = false;
      if (this.stack.indexOf(nextView) === this.stack.length - 2) {
        this.willHideDialog = true;
      } else {
        this.transform(this.stack.pop().undelegateEvents(), 1, true);
        this.transform = this.slideTransform;
        return this.stack[this.stack.length - 1];
      }
    };

    ViewStack.prototype.activateCurrentView = function(prevView, isPush) {
      var base, nextView;
      nextView = this.stack[this.stack.length - 1];
      if (!this.willShowDialog) {
        this.cleanup(nextView.$el);
      }
      if (this.preventTransition) {
        nextView.delegateEvents().$el.show().addClass("active");
        if (prevView != null) {
          prevView.$el.hide();
        }
        return this.preventTransition = false;
      } else if (prevView !== nextView) {
        if (typeof (base = prevView.undelegateEvents()).hide === "function") {
          base.hide();
        }
        prevView.$el.css({
          zIndex: this.stack.length + (isPush ? -1 : 1)
        });
        nextView.$el.css({
          zIndex: this.stack.length
        });
        nextView.$el.show().addClass("active");
        this.transitionView(nextView, false);
        this.transitionView(prevView, false);
        if (!this.willShowDialog) {
          this.transform(prevView, 0, !isPush);
        }
        if (!this.willHideDialog) {
          this.transform(nextView, this.endRatio(isPush), isPush);
        }
        this.$el.get(0).offsetWidth;
        this.transitionView(nextView, true);
        this.transform(nextView, 0, !isPush);
        if (!this.willShowDialog) {
          this.transitionView(prevView, true);
          this.transform(prevView, this.endRatio(!isPush), !isPush);
        }
        window.clearTimeout(this.transitionOutTimeout);
        return this.transitionOutTimeout = window.setTimeout(((function(_this) {
          return function() {
            nextView.delegateEvents();
            prevView.$el.removeClass("active");
            if (!_this.willShowDialog) {
              prevView.$el.hide();
            }
            _this.clearTransforms(nextView);
            return _this.clearTransforms(prevView);
          };
        })(this)), this.ms + 100);
      }
    };

    ViewStack.prototype.cleanup = function($el) {
      window.clearTimeout(this.cleanupTimeout);
      return this.cleanupTimeout = window.setTimeout(((function(_this) {
        return function() {
          if ($el.hasClass("active") && !_this.slide) {
            _this.$(".view").not($el).hide().removeClass("active");
            return $el.show().addClass("active");
          }
        };
      })(this)), this.ms);
    };

    ViewStack.prototype.endRatio = function(isPush) {
      if (isPush) {
        return 1;
      } else {
        return -0.5;
      }
    };

    ViewStack.prototype.events = function() {
      var events;
      events = {};
      events[isTouch ? "touchstart" : "mousedown"] = "onStart";
      events[isTouch ? "touchmove" : "mousemove"] = "onMove";
      events[isTouch ? "touchend" : "mouseup"] = "onEnd";
      events[isTouch ? "touchcancel" : "mouseleave"] = "onEnd";
      return events;
    };

    ViewStack.prototype.onStart = function(e) {
      var _e, inPrevStack, index, nextView, prevView, ref;
      prevView = this.stack[this.stack.length - 1];
      inPrevStack = ((ref = prevView.stack) != null ? ref.indexOf(prevView.__key) : void 0) > 0;
      if ((this.stack.length < 2 && !inPrevStack) || e.target.nodeName.match(/INPUT|TEXTAREA/) || this.stack.slice(-1)[0].preventPop === true) {
        return;
      }
      _e = isTouch ? e.touches[0] : e;
      if (this.offset == null) {
        this.offset = this.$el.offset();
      }
      this.hasSlid = false;
      if (_e.pageX - this.offset.left < 40) {
        if (inPrevStack) {
          index = prevView.stack.indexOf(prevView.__key) - 1;
          nextView = this.views[prevView.stack[index]];
        } else {
          nextView = this.stack[this.stack.length - 2];
        }
        prevView.$el.css({
          zIndex: this.stack.length
        });
        nextView.$el.css({
          zIndex: this.stack.length - 1
        });
        this.slide = {
          startX: _e.pageX - this.offset.left,
          startY: _e.pageY,
          prev: prevView,
          next: nextView
        };
        return this.onMove(e);
      }
    };

    ViewStack.prototype.onMove = function(e) {
      var _e;
      if (this.slide == null) {
        return;
      }
      if (e.type === "touchmove") {
        e.preventDefault();
      }
      _e = isTouch ? e.touches[0] : e;
      if (!this.hasSlid) {
        if (Math.abs(_e.pageX - this.offset.left - this.slide.startX) > 10) {
          this.hasSlid = true;
          this.slide.prev.undelegateEvents();
          this.slide.next.undelegateEvents();
          this.transitionView(this.slide.prev, false);
          this.transitionView(this.slide.next, false);
          this.transform = this.slideTransform;
          this.slide.next.$el.show();
          this.slide.prev.$el.show();
        } else if (Math.abs(_e.pageY - this.slide.startY) > 20) {
          this.onEnd();
        }
      }
      if (this.hasSlid) {
        e.stopPropagation();
        this.slide.ratio = Math.min(Math.max((_e.pageX - this.offset.left - this.slide.startX) / this.offset.width, 0), 1);
        this.transform(this.slide.prev, this.slide.ratio, true);
        return this.transform(this.slide.next, -(1 - this.slide.ratio) * 0.5, false);
      }
    };

    ViewStack.prototype.onEnd = function(e) {
      var next, prev;
      if (this.slide == null) {
        return;
      }
      this.transitionView(this.slide.prev, true);
      this.transitionView(this.slide.next, true);
      if (this.hasSlid) {
        e.stopPropagation();
        next = this.slide.next;
        prev = this.slide.prev;
        if (this.slide.ratio > 0.5) {
          this.transform(prev, this.endRatio(true), true);
          this.transform(next, 0, true);
          this.preventTransition = true;
          this.cleanup(this.slide.next.$el);
          this.undelegateEvents();
          window.clearTimeout(this.transitionEndTimeout);
          this.transitionEndTimeout = window.setTimeout(((function(_this) {
            return function() {
              if (_this.isLinear) {
                window.history.back();
                return _this.delegateEvents();
              } else {
                return _this.show(next.__key);
              }
            };
          })(this)), this.ms + 100);
        } else {
          this.transform(prev, 0, false);
          this.transform(next, this.endRatio(false), false);
          this.cleanup(this.slide.prev.$el);
          prev.delegateEvents();
        }
      }
      return this.slide = null;
    };

    ViewStack.prototype.transitionView = function(view, willTransition) {
      var transition;
      transition = willTransition ? "all " + this.ms + "ms" : "none";
      return view.__head.add(view.__body).css({
        "-webkit-transition": transition,
        "-moz-transition": transition,
        "-ms-transition": transition,
        "-o-transition": transition,
        "transition": transition
      });
    };

    ViewStack.prototype.slideTransform = function(view, ratio, isPush) {
      var transform;
      if (view) {
        transform = "translate3d(" + (ratio * 100) + "%, 0, 0)";
        view.__body.css({
          "-webkit-transform": transform,
          "-moz-transform": transform,
          "-ms-transform": transform,
          "-o-transform": transform,
          "transform": transform,
          "opacity": !isPush ? 1 + ratio : 1
        });
        return view.__head.css({
          "opacity": isPush ? 1 - ratio : 1
        });
      }
    };

    ViewStack.prototype.zoomTransform = function(view, ratio, isPush) {
      var transform;
      if (view) {
        transform = "translate3d(0, 0, 0) scale(" + (1 + ratio * 0.25) + ")";
        view.__body.css({
          "-webkit-transform": transform,
          "-moz-transform": transform,
          "-ms-transform": transform,
          "-o-transform": transform,
          "transform": transform,
          "opacity": isPush ? 1 - ratio : 1
        });
        return view.__head.css({
          "opacity": isPush ? 1 - ratio : 1
        });
      }
    };

    ViewStack.prototype.fadeTransform = function(view, ratio, isPush) {
      if (view) {
        view.__body.css({
          "opacity": isPush ? 1 - ratio : 1
        });
        return view.__head.css({
          "opacity": isPush ? 1 - ratio : 1
        });
      }
    };

    ViewStack.prototype.clearTransforms = function(view) {
      if (view) {
        view.__body.css({
          "-webkit-transform": "",
          "-moz-transform": "",
          "-ms-transform": "",
          "-o-transform": "",
          "transform": "",
          "opacity": ""
        });
        return view.__head.css({
          "opacity": ""
        });
      }
    };

    return ViewStack;

  })(Backbone.View);
})();
