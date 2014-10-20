define(function(require, exports, module) {
    "use strict";

    var FileAPIUtil = function() {

    };
    FileAPIUtil.isSupported = function() {
        return window.File && window.FileReader && window.FileList && window.Blob;
    };

    FileAPIUtil.createObjectURL = function(file) {
        if (window.webkitURL) {
            return window.webkitURL.createObjectURL(file);
        } else if (window.URL && window.URL.createObjectURL) {
            return window.URL.createObjectURL(file);
        } else {
            return null;
        }
    };

    module.exports = FileAPIUtil;
});
