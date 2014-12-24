module.exports = ->
  @loadNpmTasks "grunt-contrib-copy"

  # Move bower_components and app logic during a build.
  @config "copy",
    release:
      files: [
        {src: "bower_components/**", dest: "../www/"}
        {src: "lib/**", dest: "../www/"}
        {src: "app/img/**", dest: "../www/"}
        {src: "app/styles/**", dest: "../www/"},
        {src: "daydream.html", dest: "../www/"},
        {src: "app/resources/**", dest: "../www/"}
      ]
