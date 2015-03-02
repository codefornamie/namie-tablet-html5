/* global fn: true */
/* global require: false */
fn = function(request) {
    var userscript;
    try {
        userscript = new common.RadiationUserScript(request);
    } catch (e) {
        return e.serialize();
    }
    return userscript.execute();
};
var common = require("common");
