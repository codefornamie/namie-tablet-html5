/* global fn: true */
/* global require: false */

fn = function(request) {
    var userscript;
    try {
        userscript = new common.AchievementUserScript(request);
        return userscript.execute();
    } catch (e) {
        if (e instanceof common.PIOUserScriptException) {
            return e.serialize();
        } else {
            return new common.PIOUserScriptException('Script Execution Failed.', [], e).serialize();
        }
        
    }
};
var common = require("common");
