/* jshint eqnull:true */

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 運用管理ツールのヘッダのViewクラスを作成する。
     * 
     * @class ヘッダのViewクラス
     * @exports HeaderView
     * @constructor
     */
    var HeaderView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberOf HeaderView#
         */
        template : require("ldsh!templates/ope/common/header"),
        /**
         * Viewの描画処理の後に呼び出されるコールバック関数。
         * @memberOf HeaderView#
         */
        afterRendered : function() {
            this.$el.foundation();
        },
        events : {
            'click a': 'onClickAnchor',
        },
        onClickAnchor: function(event) {
            this.followAnchor(event);
        }
    });

    module.exports = HeaderView;
});
