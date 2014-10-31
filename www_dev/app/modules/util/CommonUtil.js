define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    /**
     * 汎用ユーティリティクラス
     */
    var CommonUtil = function() {

    };
    /**
     * ログインユーザ情報を取得する。
     * @return {object} ログインユーザ情報
     */
    CommonUtil.getLoginUser = function() {
        return app.user;
    };
    /**
     * 文字列をコンテンツに表示できる形に置換する
     *
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

    module.exports = CommonUtil;
});
