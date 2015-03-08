# Require
fs = require "fs"
flour = require "flour"
rmdir = require "rimraf"
jade = require "jade"
{exec} = require "child_process"

# Name and version taken from package
config = require('./package.json')
bower = require('./bower.json')

# Prepend files with info comments
prepend = """/* #{config.name} - v#{config.version} - #{config.license} */
             /* #{config.description} */
             /* #{config.repository.url} */\n"""

# Bare coffeescript
flour.compilers.coffee.bare = true

# Update bower.json, to match package.json
# Using npm version will therefore update bower
task "build:bower", ->
  bower.version = config.version
  fs.writeFile "bower.json", JSON.stringify(bower, null, 2)

# Compile and uglify js and sass
task "build:src", ->
  compile "src/#{config.name}.coffee", (res) ->
    fs.writeFile "build/#{config.name}.js", prepend + res, ->
      minify "build/#{config.name}.js", (res) ->
        fs.writeFile "build/#{config.name}.min.js", prepend + res

  exec "sass -t expanded --compass src/#{config.name}.sass", (err, res) ->
    fs.writeFile "build/#{config.name}.css", prepend + res
    fs.writeFile "build/#{config.name}.scss", prepend + res

  exec "sass -t compressed --compass src/#{config.name}.sass", (err, res) ->
    fs.writeFile "build/#{config.name}.min.css", prepend + res

# Move assets into demo
task "build:demo", ->
  fs.createReadStream("build/#{config.name}.js")
    .pipe(fs.createWriteStream("demo/vendor/js/#{config.name}.js"))

  fs.readFile "README.md", (err, res) ->
    fs.writeFile "demo/app/README.md",
      "---\nversion: #{config.version}\n---\n\n" + res

  exec "brunch b -P", cwd: "./demo"

task "build", ->
  invoke "build:src"
  invoke "build:bower"
  invoke "build:demo"

# Watch for changes
task "watch", ->
  invoke "build"
  watch "src/*.coffee", -> invoke "build"
  watch "src/*.sass", -> invoke "build"

# Lint js
task "lint", "Check javascript syntax", ->
  lint "build/#{config.name}.js"
