module.exports = ->
  @loadNpmTasks "grunt-karma"

  # Change this to the framework you want to use.
  framework = "mocha"

  # Unit testing is provided by Karma.  Change the two commented locations
  # below to either: mocha, jasmine, or qunit.
  @config "karma",
    options:
      basePath: process.cwd()
      singleRun: true
      captureTimeout: 7000
      autoWatch: true
      logLevel: "ERROR"

      reporters: ["dots", "coverage", "junit"]
      browsers: ["PhantomJS"]

      frameworks: [framework]

      plugins: [
        "karma-jasmine"
        "karma-mocha"
        "karma-qunit"
        "karma-phantomjs-launcher",
        "karma-chrome-launcher",
        "karma-coverage",
        "karma-junit-reporter"
      ]

      preprocessors:
        "app/**/*.js": "coverage"

      coverageReporter:
        reporters: [
          {
            type: "clover"
            dir: "reports/coverage"
          }
          {
            type: "lcov"
            dir: "reports/coverage"
          }
        ]

      junitReporter:
        outputFile: "reports/test/test-results.xml"
        suite: ""

      files: [
        # You can optionally remove this or swap out for a different expect.
        "bower_components/assert/assert.js"
        "bower_components/requirejs/require.js"
        "test/runner.js"

        { pattern: "app/**/*.*", included: false }
        {
          pattern: "test/#{framework}/**/*.spec.js",
          included: false
        }
        { pattern: "bower_components/**/*.js", included: false }
        { pattern: "lib/**/*.js", included: false }
        { pattern: "test/mocha/specs/*.js", included: false }
      ]

    # This creates a server that will automatically run your tests when you
    # save a file and display results in the terminal.
    daemon:
      options:
        singleRun: false

    # This is useful for running the tests just once.
    run:
      options:
        singleRun: true
