module.exports = ->
  @loadNpmTasks "grunt-text-replace"

  @config "replace",
  mode:
    src: ['../www/source.min.js'],
    overwrite: true,
    replacements: [{
      from: /{mode}/g,
      to: (matchedWord, index, fullText, regexMatches) ->
          '<%= grunt.file.readJSON("mode.json").mode %>'
    }]

  devmode_news:
    src: ['../www_dev/app/resources/appConfig.js'],
    overwrite: true,
    replacements: [{
      from: /\"mode\" : \".*\"/g,
      to: (matchedWord, index, fullText, regexMatches) ->
          '\"mode\" : \"news\"'
    }]

  devmode_ope:
    src: ['../www_dev/app/resources/appConfig.js'],
    overwrite: true,
    replacements: [{
      from: /\"mode\" : \".*\"/g,
      to: (matchedWord, index, fullText, regexMatches) ->
          '\"mode\" : \"ope\"'
    }]

  devmode_posting:
    src: ['../www_dev/app/resources/appConfig.js'],
    overwrite: true,
    replacements: [{
      from: /\"mode\" : \".*\"/g,
      to: (matchedWord, index, fullText, regexMatches) ->
          '\"mode\" : \"posting\"'
    }]

  devmode_dojo:
    src: ['../www_dev/app/resources/appConfig.js'],
    overwrite: true,
    replacements: [{
      from: /\"mode\" : \".*\"/g,
      to: (matchedWord, index, fullText, regexMatches) ->
          '\"mode\" : \"dojo\"'
    }]

  devmode_letter:
    src: ['../www_dev/app/resources/appConfig.js'],
    overwrite: true,
    replacements: [{
      from: /\"mode\" : \".*\"/g,
      to: (matchedWord, index, fullText, regexMatches) ->
          '\"mode\" : \"letter\"'
    }]
