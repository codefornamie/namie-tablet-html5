module.exports = ->
  @loadNpmTasks "grunt-plato"

  # Run your source code through Plato.
  @config "plato", 
  options:
    complexity:
      logicalor: true
      switchcase: true
      forin: true
      trycatch: true

  dist:
    files:
      "reports/plato": ["app/**/*.js"]

