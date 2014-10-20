define(function(require, exports, module) {
    "use strict";

    var StringUtil = function() {

    };
    StringUtil.startsWith = function(str, prefix) {
        return str.lastIndexOf(prefix, 0) === 0;
    };

    module.exports = StringUtil;
});
