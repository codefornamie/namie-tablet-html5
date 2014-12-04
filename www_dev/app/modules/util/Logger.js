define(function(require, exports, module) {
    "use strict";

    var Logger = function() {
        this.make();
    };
    Logger.info = function(msg) {
        console.log(msg);
    };
    Logger.debug = function(msg) {
        console.log(msg);
    };
    module.exports = Logger;
});
