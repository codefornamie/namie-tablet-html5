define(function(require, exports, module) {
    "use strict";
    var app = require("app");
    var Class = require("modules/util/Class");

    /**
     * イベント情報の基底クラスを作成する。
     * @class イベント情報の基底クラス
     * @constructor
     */
    var AbstractEvent = Class.extend({
        /**
         * 初期化
         * @memberOf AbstractEvent#
         * @param {String} code このイベントのコード
         * @param {String} message このイベントの内容を示すメッセージ
         */
        init : function(code, message) {
            this.code = code;
            this.message = message;
        }
    });


    module.exports = AbstractEvent;
});
