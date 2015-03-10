module.exports = ->
  @loadNpmTasks "grunt-contrib-concat"

  @config "concat",
    us:
      src: [
        'userscript/util/CommonUtil.js'
        'userscript/util/*.js'
        'userscript/exception/PIOUserScriptException.js'
        'userscript/exception/*.js'
        'userscript/PIOUserScript.js'
        'userscript/script/common/AbstractRegisterUserScript.js'
        'userscript/script/*.js'
      ]
      dest: '../userscript/common.js'

