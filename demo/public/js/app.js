(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("app", function(exports, require, module) {
var AppRouter, Application;

AppRouter = require("./router");

Application = {
  initialize: function(callback) {
    FastClick.attach(document.body);
    this.router = new AppRouter();
    return callback();
  }
};

module.exports = Application;
});

;require.register("initialize", function(exports, require, module) {
var app;

app = require("app");

$(function() {
  return app.initialize(function() {
    return Backbone.history.start();
  });
});
});

;require.register("router", function(exports, require, module) {
var AppRouter, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppRouter = (function(_super) {
  __extends(AppRouter, _super);

  function AppRouter() {
    _ref = AppRouter.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AppRouter.prototype.initialize = function() {
    this.viewstack = new Backbone.ViewStack({
      viewPath: "views/",
      el: "#views",
      isLinear: false,
      bodyClass: ".view-body"
    });
    return this.viewstack.create("level4", require("views/level4"), {});
  };

  AppRouter.prototype.routes = {
    "level1": "level1",
    "level2": "level2",
    "level3": "level3",
    "zoom": "zoom",
    "fade": "fade",
    "*default": "level1"
  };

  AppRouter.prototype.level1 = function() {
    return this.viewstack.show("level1");
  };

  AppRouter.prototype.level2 = function() {
    return this.viewstack.show("level2");
  };

  AppRouter.prototype.level3 = function() {
    return this.viewstack.show("level3");
  };

  AppRouter.prototype.zoom = function() {
    return this.viewstack.show("level4", {
      transition: "zoom"
    });
  };

  AppRouter.prototype.fade = function() {
    return this.viewstack.show("level4", {
      transition: "fade"
    });
  };

  return AppRouter;

})(Backbone.Router);

module.exports = AppRouter;
});

;require.register("views/level1", function(exports, require, module) {
var Level1View, app, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

app = require("app");

Level1View = (function(_super) {
  __extends(Level1View, _super);

  function Level1View() {
    _ref = Level1View.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Level1View.prototype.template = require("./templates/level1");

  Level1View.prototype.initialize = function() {
    return this.$el.html(this.template());
  };

  Level1View.prototype.show = function() {
    app.router.navigate("level1");
    return console.log("Show Level 1");
  };

  Level1View.prototype.hide = function() {
    return console.log("Hide Level 1");
  };

  return Level1View;

})(Backbone.View);

module.exports = Level1View;
});

;require.register("views/level2", function(exports, require, module) {
var Level2View, app, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

app = require("app");

Level2View = (function(_super) {
  __extends(Level2View, _super);

  function Level2View() {
    _ref = Level2View.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Level2View.prototype.template = require("./templates/level2");

  Level2View.prototype.stack = ["level1", "level2"];

  Level2View.prototype.initialize = function() {
    return this.$el.html(this.template());
  };

  Level2View.prototype.show = function() {
    app.router.navigate("level2", true);
    return console.log("Show Level 2");
  };

  Level2View.prototype.hide = function() {
    return console.log("Hide Level 2");
  };

  return Level2View;

})(Backbone.View);

module.exports = Level2View;
});

;require.register("views/level3", function(exports, require, module) {
var Level3View, app, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

app = require("app");

Level3View = (function(_super) {
  __extends(Level3View, _super);

  function Level3View() {
    _ref = Level3View.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Level3View.prototype.template = require("./templates/level3");

  Level3View.prototype.stack = ["level1", "level2", "level3"];

  Level3View.prototype.initialize = function() {
    return this.$el.html(this.template());
  };

  Level3View.prototype.show = function() {
    app.router.navigate("level3");
    return console.log("Show Level 3");
  };

  Level3View.prototype.hide = function() {
    return console.log("Hide Level 3");
  };

  return Level3View;

})(Backbone.View);

module.exports = Level3View;
});

;require.register("views/level4", function(exports, require, module) {
var Level4View, app, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

app = require("app");

Level4View = (function(_super) {
  __extends(Level4View, _super);

  function Level4View() {
    _ref = Level4View.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Level4View.prototype.template = require("./templates/level4");

  Level4View.prototype.initialize = function() {
    return this.$el.html(this.template());
  };

  Level4View.prototype.show = function(options) {
    app.router.navigate(options.transition, true);
    this.$(".name").html(options.transition);
    return console.log("Show Level 4");
  };

  Level4View.prototype.hide = function() {
    return console.log("Hide Level 4");
  };

  return Level4View;

})(Backbone.View);

module.exports = Level4View;
});

;require.register("views/templates/level1", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"view-head nav-bar\"><div class=\"nav-bar-button-left\"><div class=\"icon icon-menu\"></div></div><div class=\"nav-bar-title\">Level 1</div><div class=\"nav-bar-button-right\"></div></div><div class=\"view-body\"><div class=\"content\"><p>This view is at the start (or bottom) of the stack. You won't be able to pop this view, because there is nothing underneath. This means that manually swiping on the left part of the screen will have no affect.</p><p>All new views will automatically push onto the stack, unless they already exist within it.</p><a href=\"#level2\" class=\"button\">Go to Level 2</a><a href=\"#level3\"><small>Skip to Level 3</small></a></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/level2", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"view-head nav-bar\"><a href=\"#level1\" class=\"nav-bar-button-left\">Back</a><div class=\"nav-bar-title\">Level 2</div></div><div class=\"view-body\"><div class=\"content\"><p>This view is automatically pushed onto the view. You can manually swipe back to the last view.</p><p>Because this view declares a stack, the stack is created on initialization. This means you can refresh the page and still manually swipe back.</p><pre>stack: [\"level1\", \"level2\"]</pre><a href=\"#level3\" class=\"button\">Go to level 3</a><a href=\"#fade\" class=\"button\">Fade to popover</a><a href=\"#zoom\" class=\"button\">Zoom to popover</a></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/level3", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"view-head nav-bar\"><a href=\"#level2\" class=\"nav-bar-button-left\">Back</a><div class=\"nav-bar-title\">Level 3</div></div><div class=\"view-body\"><div class=\"content\"><p>The stack is clever enough to figure out whether to pop the view based on the occurance of the new view in the view stack. For this reason, if we jump back to Level 1, the pop will naturally occur without any extra setup.</p><p>If you skipped from Level 1 to 3, Level 2 has not been created. This isn't a problem, though, because Level 3 declares a stack in just the same way as 2. This means that navigating to Level 2 will still pop the view.</p><small><pre>stack: [\"level1\", \"level2\", \"level3\"]</pre></small><a href=\"#level1\" class=\"button\">Go all the way back to Level 1</a></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/level4", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"view-body\"><div class=\"content\"><h1 class=\"name\">Type</h1><p>If you show a new view and set a transition, the stack assumes the view should leave the same way it entered.</p><code><pre>viewstack.show(\"name\", {\n  transition: \"<span class=\"name\">type</span>\"\n})\n</pre></code><a href=\"#level2\" class=\"button\">Close</a></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;
//# sourceMappingURL=app.js.map