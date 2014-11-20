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
