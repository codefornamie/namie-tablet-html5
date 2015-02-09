define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var Super = AbstractView;

    /**
     * 放射線アプリのクラスター項目を表示するためのViewクラスを作成する。
     * 
     * @class 放射線アプリのクラスター項目を表示するためのView
     * @exports RadClusterListItemView
     * @constructor
     */
    var RadClusterListItemView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/top/radClusterListItem"),

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * @memberOf RadClusterListItemView#
         */
        beforeRendered : function() {
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf RadClusterListItemView#
         */
        afterRendered : function() {
        },
        
        /**
         * 初期化
         * @memberOf RadClusterListItemView#
         */
        initialize: function() {
        }
    });

    module.exports = RadClusterListItemView;
});
