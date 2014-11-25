module.exports = ->
  @loadNpmTasks "grunt-bbb-server"

  @config "server",
    options:
      host: "0.0.0.0"
      port: process.env.PORT || 8000

    development: {}

    release:
      options:
        prefix: "../www"

    test:
      options:
        forever: false
        port: 8001
