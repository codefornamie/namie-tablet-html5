module.exports = ->
  @loadNpmTasks "grunt-jsdoc"

  # Run your source code through JSDoc's defaults.
  @config "jsdoc", 
  options:
    destination: "reports/doc"
    configure: "jsdoc-config.json"
  src: [
    "app/**/*.js"
    "README.md"
  ]

