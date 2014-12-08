module.exports = ->
  @loadNpmTasks "grunt-contrib-connect"

  @config "connect",
    options:
      hostname: "0.0.0.0"
      port: process.env.PORT || 8000
      keepalive: true
      base: "."

    development: {}

    release:
      options:
        base: "../www"

    test:
      options:
        port: 8001
        keepalive: false
