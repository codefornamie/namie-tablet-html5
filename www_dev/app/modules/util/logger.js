define(function(require, exports, module) {
    "use strict";

    var Logger = function() {

    };
    Logger.info = function(msg) {
        console.log(msg);
    };
    module.exports = Logger;
});
