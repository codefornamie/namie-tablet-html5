define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    /**
     * 汎用ユーティリティクラス
     * @class 汎用ユーティリティクラス
     * @constructor
     */
    var CommonUtil = function() {

    };
    /**
     * 文字列をコンテンツに表示できる形に置換する
     *
     * @memberOf CommonUtil#
     * @param {String}
     *            str 対象となる文字列
     * @return {String} 置換された文字列
     */
    CommonUtil.sanitizing = function(str) {
        if (str && typeof str === "string") {
            return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/[\r\n]/g, '<br />');
        } else {
            return str;
        }
    };
    /**
     * 文字列の半角スペースを削除する。。
     *
     * @param {String}
     *            str 文字列
     * @return {String} 半角スペースを削除した文字列
     * @memberOf CommonUtil#
     */
    CommonUtil.blankTrim = function (str){
        if (str && typeof str === "string") {
            return str.replace(/ /g, "");
        }
        return str;
    };

    module.exports = CommonUtil;
});
