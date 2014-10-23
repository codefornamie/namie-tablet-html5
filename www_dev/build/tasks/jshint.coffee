module.exports = ->
  @loadNpmTasks "grunt-contrib-jshint"

  # Run your source code through JSHint's defaults.
  @config "jshint",
  options:
    reporter: "checkstyle"
    reporterOutput: "reports/jshint/jshint-results.xml"
    force: false

  build:
    src: "app/**/*.js"
