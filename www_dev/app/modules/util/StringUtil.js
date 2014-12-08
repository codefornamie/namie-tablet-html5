define(function(require, exports, module) {
    "use strict";

    var StringUtil = function() {

    };
    /**
     * 先頭文字が対象の値であるかの判定をする。
     * @param {String} str 検索対象
     * @param {Object} prefix 検索する値
     * @return 先頭文字が対象の値であるかの真偽値 ture:対象文字, false:対象文字でない
     */
    StringUtil.startsWith = function(str, prefix) {
        return str.lastIndexOf(prefix, 0) === 0;
    };

    module.exports = StringUtil;
});
