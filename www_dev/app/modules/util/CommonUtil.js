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

    module.exports = CommonUtil;
});
