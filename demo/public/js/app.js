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
require.register("README", function(exports, require, module) {
module.exports = {"version":"0.9.0","__content":"<h2 id=\"backbone-viewstack-js\">backbone.viewstack.js</h2>\n<h3 id=\"what-is-it-\">What is it?</h3>\n<p>See the <a href=\"http://creative-licence-digital.github.io/backbone.viewstack/demo/public/\">demo</a>. Try saving it to your home screen for the full impact.</p>\n<p>backbone.viewstack.js provides seamless management of view stacks, allowing fluid transition and navigation between mulitple views and creating a stack on the fly - all without having to write any boilerplate yourself. It&#39;s the ideal solution for Cordova/Phonegap based apps that need to provide a native look and feel with a hybrid solution.</p>\n<p>The library offers several core features:</p>\n<ul>\n<li>iOS UINavigationController-like transition between views out of the box, where the navigation bar and content transition independently.</li>\n<li>Smart management of a stack means pushing and popping is managed easily.</li>\n<li>Users are able to pop views by swiping from the left 40 pixels of the screen exactly like on native iOS apps.</li>\n<li>Stacks can be declared within views and created during an app&#39;s initialization for dead-simple preloaded views.</li>\n<li>Transitions use element caches and hardware accelerated transforms for high performance animations, expecially geared towards mobile devices.</li>\n</ul>\n<p><img src=\"/qrcode.png\" alt=\"http://creative-licence-digital.github.io/backbone.viewstack/demo/public/\"></p>\n<h3 id=\"how-to-use-it\">How to use it</h3>\n<p>Download the source files from the <code>build</code> directory, or use <a href=\"http://www.bower.io/\">Bower</a>.</p>\n<pre><code class=\"lang-bash\">$ bower install backbone.viewstack.js\n</code></pre>\n<p>Then include the javascript (and optional css) after Backbone on the page.</p>\n<p>The basic structure of the view stack HTML is as follows:</p>\n<pre><code class=\"lang-html\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">id</span>=<span class=\"hljs-value\">\"views\"</span>&gt;</span>\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">id</span>=<span class=\"hljs-value\">\"level-1-view\"</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"view\"</span>&gt;</span>\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"view-head\"</span>&gt;</span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-title\">div</span> <span class=\"hljs-attribute\">class</span>=<span class=\"hljs-value\">\"view-body\"</span>&gt;</span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\n  <span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-title\">div</span>&gt;</span>\n</code></pre>\n<p>The view head and view body are then transitioned indepedently when navigating between routes.</p>\n<p>To get started, create a new view stack. A good place to do this is in your app router.</p>\n<pre><code class=\"lang-js\"><span class=\"hljs-keyword\">var</span> myAppRouter = Backbone.Router.extend({\n\n  initialize: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">()</span></span>{\n    <span class=\"hljs-keyword\">this</span>.viewstack = <span class=\"hljs-keyword\">new</span> Backbone.ViewStack({\n      viewPath: <span class=\"hljs-string\">\"views/\"</span>,\n      isLinear: <span class=\"hljs-literal\">true</span>,           <span class=\"hljs-comment\">// optional</span>\n      el: <span class=\"hljs-string\">\"#views\"</span>,             <span class=\"hljs-comment\">// optional selector/element for parent</span>\n      headClass: <span class=\"hljs-string\">\".view-head\"</span>,  <span class=\"hljs-comment\">// optional selector for view's nav bar</span>\n      bodyClass: <span class=\"hljs-string\">\".view-body\"</span>   <span class=\"hljs-comment\">// optional selector for view's content</span>\n      overwrite: <span class=\"hljs-literal\">true</span>           <span class=\"hljs-comment\">// optionally replace the element's content</span>\n    })\n  }\n});\n</code></pre>\n<p>Ensure you pass a <code>viewPath</code> so your views can be required correctly.</p>\n<p>Your app routes can now use <code>this.viewstack.show</code> to show new views.</p>\n<pre><code class=\"lang-js\">exampleRoute: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">()</span></span>{\n  <span class=\"hljs-keyword\">this</span>.viewstack.show(<span class=\"hljs-string\">\"level1\"</span>, {})\n}\n</code></pre>\n<p>backbone.viewstack will require your views on the fly, initialize them into a new element and append them to the backbone.viewstack view.</p>\n<p>If you need to pass options for you view when it&#39;s initialized, these can be passed in this method.</p>\n<p>If you aren&#39;t using a CommonJS/AMD wrapper in your project, you can still use backbone.viewstack. All you have to do is create your views in the stack before showing them. Simply pass a name for your view, the view constructor and the options with which to initialize the view.</p>\n<pre><code class=\"lang-js\"><span class=\"hljs-keyword\">this</span>.viewstack.create(<span class=\"hljs-string\">\"myView\"</span>, MyView, {})\n</code></pre>\n<h3 id=\"hooks\">Hooks</h3>\n<p>When the view stack pushes or pops a view, it provides hooks to update the views accordingly. If the view declares a <code>show</code> or <code>hide</code> method, these are called at the appropriate times.</p>\n<p>The <code>show</code> hook is passed the same options as when the view is initialized, so any options passed by the router will be available.</p>\n<pre><code class=\"lang-js\"><span class=\"hljs-keyword\">var</span> exampleView = Backbone.View.extend({\n\n  show: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(options)</span></span>{\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-string\">\"exampleView was shown\"</span>)\n  },\n\n  hide: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">()</span></span>{\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-string\">\"exampleView was hidden\"</span>)\n  }\n});\n</code></pre>\n<p>Views that don&#39;t already have and <code>open</code> or <code>exit</code> method will be given one. <code>open</code> will show the view if it exists, and takes the same options that are returned in <code>show</code> and <code>initialize</code>. <code>exit</code> will close the current view if it is at the top of the stack. It doesn&#39;t take any parameters.</p>\n<pre><code class=\"lang-js\">  exampleView.open({}); <span class=\"hljs-comment\">// Open the current view</span>\n\n  exampleView.exit();   <span class=\"hljs-comment\">// Exit the view if it's on top</span>\n</code></pre>\n<h3 id=\"swipe-to-go-back\">Swipe to go back</h3>\n<p>If your app can be loaded on views part way down the stack, you can declare a stack array in the view that is being shown. There is a caveat, though. The viewstack defaults to <code>window.history.back()</code> when swiping to go back, but this will not work when there is no history. Apps that could load part way down the stack should pass <code>isLinear: false</code> when initializing the stack and manage the router&#39;s navigation in the <code>show</code> method of each view. See the <a href=\"http://creative-licence-digital.github.io/backbone.viewstack/demo/public/\">demo</a> for an example of this.</p>\n<h3 id=\"event-management\">Event management</h3>\n<p>backbone.viewstack automatically handles event delegation for your views. When a view is hidden, <code>undelegateEvents</code> is called to ensure no events are left around when they&#39;re no longer needed.</p>\n<h3 id=\"transitions\">Transitions</h3>\n<p>Three transitions are included out of the box. These are <code>swipe</code>, <code>fade</code> and <code>zoom</code>. Swipe is the default, but if you want to use fade or zoom pass these in the <code>show</code> methods options like so:</p>\n<pre><code class=\"lang-js\"><span class=\"hljs-keyword\">this</span>.viewstack.show(<span class=\"hljs-string\">\"level1\"</span>, {transition: <span class=\"hljs-string\">\"fade\"</span>})\n</code></pre>\n<p>Any transition that isn&#39;t <code>swipe</code> will automatically reverse when popping, so a view that fades in will fade out, and a view that zooms in will zoom out. These transitions disable the swipe to go back functionality.</p>\n<p>If you want to write your own transitions, add a method to your view stack in the form <code>nameTranform</code> and then use <code>name</code> when you show the view. For example:</p>\n<pre><code class=\"lang-js\">myViewStack.customTransform = <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(view, ratio, isPush)</span></span>{\n  <span class=\"hljs-comment\">// the backbone view is the view itself</span>\n  <span class=\"hljs-comment\">// view.__head is a cache of the view's navigation bar element</span>\n  <span class=\"hljs-comment\">// view.__body is a cache of the view's content element</span>\n  <span class=\"hljs-comment\">// ratio is the position in the transition</span>\n  <span class=\"hljs-comment\">// isPush is true if pushing and false if popping</span>\n}\n\nmyViewStack.show(<span class=\"hljs-string\">\"viewName\"</span>, {transition: <span class=\"hljs-string\">\"custom\"</span>})\n</code></pre>\n<p><code>__head</code> and <code>__body</code> are both jQuery/Zepto elements saved onto your Backbone view on initialization. Your view <em>must</em> render these onto the DOM at initialization, or you will have to set these yourself. In the same sense, you can use <code>__head.add($elements)</code> to add more elements if you wish these to be transitioned/transformed as well.</p>\n<p>They are underscored to ensure they don&#39;t clash with any view keys you create yourself.</p>\n<h3 id=\"example\">Example</h3>\n<p>This repo includes a sample <a href=\"http://brunch.io\">brunch</a> application to help you get started.</p>\n<h3 id=\"advanced-use\">Advanced use</h3>\n<p>Because backbone.viewstack is just a view, you can easily extend its methods for custom behaviour.</p>\n<h3 id=\"developing-and-testing\">Developing and testing</h3>\n<p>There is a <code>Cakefile</code> for building, watching and linting. All these commands can be run with <code>cake</code>.</p>\n<pre><code class=\"lang-bash\">$ cake build    <span class=\"hljs-comment\"># Build the library</span>\n$ cake watch    <span class=\"hljs-comment\"># Watch for changes</span>\n</code></pre>\n<p>Feel free to submit <a href=\"https://github.com/Creative-Licence-Digital/backbone.viewstack/issues\">issues</a> or make <a href=\"https://github.com/Creative-Licence-Digital/backbone.viewstack/pulls\">pull</a> requests.</p>\n<h3 id=\"licence\">Licence</h3>\n<p>Released under MIT License (MIT)\nCopyright (c) 2014 Creative Licence Digital</p>\n"}
});

;require.register("app", function(exports, require, module) {
var AppRouter, Application;

AppRouter = require("./router");

Application = {
  initialize: function(callback) {
    FastClick.attach(document.body);
    this.router = new AppRouter();
    callback();
    if ($(window).width() > 680) {
      $("#readme").html(require("README").__content).parent().addClass("with-readme");
      $("#version").html(require("README").version);
    }
    return $("#views").on("touchmove", function(e) {
      var viewBody;
      viewBody = $(e.target).parents(".view-body").get(0);
      if (!(viewBody && viewBody.offsetHeight < viewBody.scrollHeight)) {
        return e.preventDefault();
      }
    });
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
var AppRouter, viewstack, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

viewstack = require("stack");

AppRouter = (function(_super) {
  __extends(AppRouter, _super);

  function AppRouter() {
    _ref = AppRouter.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AppRouter.prototype.initialize = function() {
    return viewstack.create("level4", require("views/level4"), {});
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
    return viewstack.show("level1");
  };

  AppRouter.prototype.level2 = function() {
    return viewstack.show("level2");
  };

  AppRouter.prototype.level3 = function() {
    return viewstack.show("level3");
  };

  AppRouter.prototype.zoom = function() {
    return viewstack.show("level4", {
      transition: "zoom"
    });
  };

  AppRouter.prototype.fade = function() {
    return viewstack.show("level4", {
      transition: "fade"
    });
  };

  return AppRouter;

})(Backbone.Router);

module.exports = AppRouter;
});

;require.register("stack", function(exports, require, module) {
module.exports = new Backbone.ViewStack({
  viewPath: "views/",
  el: "#views",
  isLinear: false,
  bodyClass: ".view-body"
});
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
var Level3View, app, viewstack, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

app = require("app");

viewstack = require("stack");

Level3View = (function(_super) {
  __extends(Level3View, _super);

  function Level3View() {
    _ref = Level3View.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Level3View.prototype.template = require("./templates/level3");

  Level3View.prototype.stack = ["level1", "level2", "level3"];

  Level3View.prototype.events = {
    "click #alert": "openAlert"
  };

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

  Level3View.prototype.openAlert = function() {
    return viewstack.show("popups/alert", {
      isDialog: true,
      key: "alert",
      transition: "zoom"
    });
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

;require.register("views/popups/alert", function(exports, require, module) {
var AlertView, app, viewstack, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

app = require("app");

viewstack = require("stack");

AlertView = (function(_super) {
  __extends(AlertView, _super);

  function AlertView() {
    _ref = AlertView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AlertView.prototype.template = require("views/templates/popups/alert");

  AlertView.prototype.events = {
    "click #close": "exit",
    "click #close-to-level1": "closeToLevel1"
  };

  AlertView.prototype.initialize = function() {
    return this.$el.html(this.template());
  };

  AlertView.prototype.show = function() {
    return console.log("Show Alert");
  };

  AlertView.prototype.hide = function() {
    return console.log("Hide Alert");
  };

  AlertView.prototype.closeToLevel1 = function() {
    return app.router.navigate("level1", true);
  };

  return AlertView;

})(Backbone.View);

module.exports = AlertView;
});

;require.register("views/templates/level1", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"view-head nav-bar\"><div class=\"nav-bar-button-left\"><div class=\"icon icon-menu\"></div></div><div class=\"nav-bar-title view-body\"> <img src=\"img/icon120.png\" width=\"40\" height=\"40\"/></div><div class=\"nav-bar-button-right\"></div></div><div class=\"view-body\"><div class=\"content\"><h1>backbone.viewstack.js</h1><p>This view is at the start (or bottom) of the stack. You won't be able to pop this view, because there is nothing underneath. This means that manually swiping on the left part of the screen will have no effect.</p><p>All new views will automatically push onto the stack, unless they already exist within it.</p><p><a href=\"#level2\" class=\"button\">Go to next level</a></p><a href=\"#level3\"><small>Skip ahead</small></a></div></div>");;return buf.join("");
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
buf.push("<div class=\"view-head nav-bar\"><a href=\"#level1\" class=\"nav-bar-button-left\">Back</a><div class=\"nav-bar-title view-body\">Next Level</div><a href=\"#level3\" class=\"nav-bar-button-right\">More</a></div><div class=\"view-body\"><div class=\"content\"><p>This view is automatically pushed onto the view. You can manually swipe back to the last view.</p><p>Because this view declares a stack, the stack is created on initialization. This means you can refresh the page and still manually swipe back.</p><pre><code>stack: [\"level1\", \"level2\"]</code></pre><a href=\"#fade\" class=\"button\">Fade to popover</a><a href=\"#zoom\" class=\"button\">Zoom to popover</a></div></div>");;return buf.join("");
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
buf.push("<div class=\"view-head nav-bar\"><a href=\"#level2\" class=\"nav-bar-button-left\">Back</a><div class=\"nav-bar-title view-body\">More</div><div id=\"alert\" class=\"nav-bar-button-right\">Alert</div></div><div class=\"view-body\"><div class=\"content\"><p>The stack is clever enough to figure out whether to pop the view based on the occurance of the new view in the view stack. For this reason, if we jump back to Level 1, the pop will naturally occur without any extra setup.</p><p>If you skipped from Level 1 to 3, Level 2 has not been created. This isn't a problem, though, because Level 3 declares a stack in just the same way as 2. This means that navigating to Level 2 will still pop the view.</p><pre><code><small>stack: [\"level1\", \"level2\", \"level3\"]</small></code></pre><a href=\"#level1\" class=\"button\">Return to the start</a></div></div>");;return buf.join("");
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
buf.push("<div class=\"view-body\"><a href=\"#level2\" class=\"close-button\">&times;</a><div class=\"content\"><h1 class=\"name\">Type</h1><p>If you show a new view and set a transition, the stack assumes the view should leave the same way it entered.</p><pre><code>viewstack.show(\"name\", {\n  transition: \"<span class=\"name\">type</span>\"\n})</code></pre></div></div>");;return buf.join("");
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

;require.register("views/templates/popups/alert", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"view-body\"><div class=\"alert-content\"><h3>Alert</h3><p>An alert view with the last view still visible by passing <pre>isDialog: true</pre></p><a id=\"close-to-level1\" class=\"button\">Return to the start</a><a id=\"close\" class=\"button\">Cancel</a></div></div>");;return buf.join("");
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