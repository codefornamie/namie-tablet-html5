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
    # "cssmin"
    "copy"
    "replace:mode"
  ]

  @registerTask "skipTests", [
    "clean"
    "processhtml"
    "requirejs"
    "styles"
    # "cssmin"
    "copy"
    "replace:mode"
  ]

  @registerTask "server", [
    "connect:development"
  ]
  @registerTask "server_news", [
    "replace:devmode_news"
    "server"
  ]
  @registerTask "server_posting", [
    "replace:devmode_posting"
    "server"
  ]
  @registerTask "server_ope", [
    "replace:devmode_ope"
    "server"
  ]
  @registerTask "server_dojo", [
    "replace:devmode_dojo"
    "server"
  ]
  @registerTask "server_letter", [
    "replace:devmode_letter"
    "server"
  ]
