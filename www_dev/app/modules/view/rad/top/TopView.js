define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var RadMapView = require("modules/view/rad/top/MapView");

    /**
     * 放射線アプリのトップ画面を表示するためのViewクラスを作成する。
     *
     * @class 放射線アプリのトップ画面を表示するためのView
     * @exports RadTopView
     * @constructor
     */
    var RadTopView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         */
        template : require("ldsh!templates/{mode}/top/top"),

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberOf RadTopView#
         */
        beforeRendered : function() {
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf RadTopView#
         */
        afterRendered : function() {
        },

        /**
         * 初期化
         * @memberOf RadTopView#
         */
        initialize : function() {
            // ローディングを開始
            this.showLoading();

            this.initCollection();
            this.initEvents();

            this.setView("#map-container", new RadMapView());

            // ローディングを停止
            this.hideLoading();
        },

        /**
         * collectionを初期化する
         * @memberOf RadTopView#
         */
        initCollection : function () {
        },

        /**
         * イベントを初期化する
         * @memberOf RadTopView#
         */
        initEvents : function() {
        }
    });

    module.exports = RadTopView;
});
