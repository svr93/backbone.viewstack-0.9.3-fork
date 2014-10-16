---
version: 0.9.0
---

## backbone.viewstack.js

### What is it?

See the [demo](http://creative-licence-digital.github.io/backbone.viewstack/demo/public/). Try saving it to your home screen for the full impact.

backbone.viewstack.js provides seamless management of view stacks, allowing fluid transition and navigation between mulitple views and creating a stack on the fly - all without having to write any boilerplate yourself. It's the ideal solution for Cordova/Phonegap based apps that need to provide a native look and feel with a hybrid solution.

The library offers several core features:

- iOS UINavigationController-like transition between views out of the box, where the navigation bar and content transition independently.
- Smart management of a stack means pushing and popping is managed easily.
- Users are able to pop views by swiping from the left 40 pixels of the screen exactly like on native iOS apps.
- Stacks can be declared within views and created during an app's initialization for dead-simple preloaded views.
- Transitions use element caches and hardware accelerated transforms for high performance animations, expecially geared towards mobile devices.

![http://creative-licence-digital.github.io/backbone.viewstack/demo/public/](/qrcode.png)

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
      isLinear: true,           // optional
      el: "#views",             // optional selector/element for parent
      headClass: ".view-head",  // optional selector for view's nav bar
      bodyClass: ".view-body"   // optional selector for view's content
      overwrite: true           // optionally replace the element's content
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

If you aren't using a CommonJS/AMD wrapper in your project, you can still use backbone.viewstack. All you have to do is create your views in the stack before showing them. Simply pass a name for your view, the view constructor and the options with which to initialize the view.

```js
this.viewstack.create("myView", MyView, {})
```

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

Views that don't already have and `open` or `exit` method will be given one. `open` will show the view if it exists, and takes the same options that are returned in `show` and `initialize`. `exit` will close the current view if it is at the top of the stack. It doesn't take any parameters.

```js
  exampleView.open({}); // Open the current view

  exampleView.exit();   // Exit the view if it's on top
```

### Swipe to go back

If your app can be loaded on views part way down the stack, you can declare a stack array in the view that is being shown. There is a caveat, though. The viewstack defaults to `window.history.back()` when swiping to go back, but this will not work when there is no history. Apps that could load part way down the stack should pass `isLinear: false` when initializing the stack and manage the router's navigation in the `show` method of each view. See the [demo](http://creative-licence-digital.github.io/backbone.viewstack/demo/public/) for an example of this.

### Event management

backbone.viewstack automatically handles event delegation for your views. When a view is hidden, `undelegateEvents` is called to ensure no events are left around when they're no longer needed.

### Transitions

Three transitions are included out of the box. These are `swipe`, `fade` and `zoom`. Swipe is the default, but if you want to use fade or zoom pass these in the `show` methods options like so:

```js
this.viewstack.show("level1", {transition: "fade"})
```

Any transition that isn't `swipe` will automatically reverse when popping, so a view that fades in will fade out, and a view that zooms in will zoom out. These transitions disable the swipe to go back functionality.

If you want to write your own transitions, add a method to your view stack in the form `nameTranform` and then use `name` when you show the view. For example:

```js
myViewStack.customTransform = function(view, ratio, isPush){
  // the backbone view is the view itself
  // view.__head is a cache of the view's navigation bar element
  // view.__body is a cache of the view's content element
  // ratio is the position in the transition
  // isPush is true if pushing and false if popping
}

myViewStack.show("viewName", {transition: "custom"})
```

`__head` and `__body` are both jQuery/Zepto elements saved onto your Backbone view on initialization. Your view *must* render these onto the DOM at initialization, or you will have to set these yourself. In the same sense, you can use `__head.add($elements)` to add more elements if you wish these to be transitioned/transformed as well.

They are underscored to ensure they don't clash with any view keys you create yourself.

### Example

This repo includes a sample [brunch](http://brunch.io) application to help you get started.

### Advanced use

Because backbone.viewstack is just a view, you can easily extend its methods for custom behaviour.

### Developing and testing

There is a `Cakefile` for building, watching and linting. All these commands can be run with `cake`.

```bash
$ cake build    # Build the library
$ cake watch    # Watch for changes
```

Feel free to submit [issues](https://github.com/Creative-Licence-Digital/backbone.viewstack/issues) or make [pull](https://github.com/Creative-Licence-Digital/backbone.viewstack/pulls) requests.

### Licence

Released under MIT License (MIT)
Copyright (c) 2014 Creative Licence Digital
