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
        /**
         * ヘッダーリンクのイベント定義
         */
        events : {
            'click a' : 'onClickAnchor',
        },
        /**
         * アンカー要素をクリックした際の共通処理を設定する。
         * @param {Event} event クリックイベント
         */
        onClickAnchor : function(event) {
            this.followAnchor(event);
        },
        /**
         * 指定したメニューアイテムをアクティブにする
         * @param {String} item アクティブにするメニュー(ope-top or ope-message or ope-slideshow)
         */
        setActiveMenu : function(item) {
            this.$("#ope-drowdown").children().removeClass("active");
            this.$("#" + item).addClass("active");
            this.$el.foundation();
        }
    });

    module.exports = HeaderView;
});
