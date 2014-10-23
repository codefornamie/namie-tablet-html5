module.exports = ->

  # Load task configurations.
  @loadTasks "build/tasks"

  # Run JSHint and a quick test.
  @registerTask "test", [
    "jshint"
    "karma:run"
  ]

  # When running the default Grunt command, just lint the code.
  @registerTask "default", [
    "clean"
    "jsdoc"
    "jshint"
    "plato"
    "karma:run"
    "processhtml"
    "requirejs"
    "styles"
    "cssmin"
    "copy"
  ]
