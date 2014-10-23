module.exports = ->
  @loadNpmTasks "grunt-contrib-clean"

  # Wipe out previous builds and test reporting.
  @config "clean", 
    options:
      force: true
    files: [
      "../www/"
      "reports/test"
      "reports/doc"
      "reports/coverage"
      "reports/jshint"
    ]
