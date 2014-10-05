## backbone.viewstack

### What is it?

backbone.viewstack emulates the native UINavigationController on iOS. It seamlessly manages the navigation between mulitple views and creates a stack on the fly without having to write the boilerplate yourself.

The library provides several core features:

- iOS-like transition between views out of the box, where the navigation bar and content transition independently.
- Smart management of a stack means pushing and popping is managed easily.
- Users are able to pop views by swiping from the left 40 pixels of the screen exactly like on native iOS apps.
- Stacks can be declared within views and created during an app's initialization for dead-simple preloaded views.
- Transitions use element caches and hardware accelerated transforms for high performance animations, expecially geared towards mobile devices.

See the [demo](http://creativelicence.github.io/backbone.viewstack/).

### How to use it

Download the source files from the `build` directory, or use [Bower](http://www.bower.io/).

```bash
$ bower install backbone.viewstack.js
```

Then include the javascript (and optional css) after Backbone on the page.

The basic structure of the view stack HTML is as follows:

```html
  <div id="views">
    <div id="level-1-view" class="view">
      <div class="view-head"></div>
      <div class="view-body"></div>
    </div>
  </div>
```

The view head and view body are then transitioned indepedently when navigating between routes.

To get started, create a new view stack. A good place to do this is in your app router.

```js
  var myAppRouter = Backbone.Router.extend({

    initialize: function(){
      this.viewstack = new Backbone.ViewStack({
        viewPath: "views/",
        el: "#views" // optional
        headClass: ".view-head" // customise selector for view's nav bar
        bodyClass: ".view-body" // customise selector for view's content
      })
    }
  });
```

Ensure you pass a `viewPath` so your views can be required correctly.

Your app routes can now use `this.viewstack.show` to show new views.

```js
  exampleRoute: function(){
    this.viewstack.show("level1", {})
  }
```

backbone.viewstack will require your views on the fly, initialize them into a new element and append them to the backbone.viewstack view.

If you need to pass options for you view when it's initialized, these can be passed in this method.

### Hooks

When the view stack pushes or pops a view, it provides hooks to update the views accordingly. If the view declares a `show` or `hide` method, these are called at the appropriate times.

The `show` hook is passed the same options as when the view is initialized, so any options passed by the router will be available.

```js
  var exampleView = Backbone.View.extend({

    show: function(options){
      console.log("exampleView was shown")
    },

    hide: function(){
      console.log("exampleView was hidden")
    }
  });
```

### Event management

backbone.viewstack automatically handles event delegation for your views. When a view is hidden, `undelegateEvents` is called to ensure no events are left around when they're no longer needed.

### Example

This repo includes a sample [brunch](http://brunch.io) application.

### Advanced use

Because backbone.viewstack is just a view, you can easily extend its methods for custom behaviour. For example, if you wanted to alter the transtion between views, simple overwrite the `transformView` method.

```js
  transformView: function(view, ratio, isPush){
    // view.view is the view itself
    // view.viewHead is a cache of the view's navigation bar element
    // view.viewBody is a cache of the view's content element
    // ratio is the position in the transition
    // isPush is true if pushing and false if popping
  }
```

### Developing and testing

There is a `Cakefile` for building, watching and linting. All these commands can be run with `cake`.

```bash
  $ cake build    # Build the library
  $ cake watch    # Watch for changes
  $ cake lint     # Lint the compiled javascript.
```

Feel free to submit [issues](https://github.com/creativelicence/backbone.viewstack/issues) or make [pull](https://github.com/creativelicence/backbone.viewstack/pulls) requests.
