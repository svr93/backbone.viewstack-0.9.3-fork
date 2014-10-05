# See http://brunch.readthedocs.org/en/latest/config.html for documentation.

exports.config =
  plugins:
    sass:
      options: ["--compass"]

  files:
    javascripts:
      joinTo:
        "js/app.js": /^app/
        "js/vendor.js": /^vendor/

      order:
        before: [
          "vendor/js/lodash.underscore-1.1.1.min.js"
          "vendor/js/zepto.min.js"
          "vendor/js/backbone.min.js"
          "vendor/js/backbone.viewstack.min.js"
        ]

    stylesheets:
      joinTo:
        "css/app.css": /sass\/app.sass/

    templates:
      defaultExtension: "jade"
      joinTo: "js/app.js"

  framework: "backbone"
