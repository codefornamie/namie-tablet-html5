define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");
    var leaflet = require("leaflet");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 放射線アプリの地図のレイヤ
     *
     * @class 放射線アプリの地図のレイヤ
     * @exports RadPopupView
     * @constructor
     */
    var RadPopupView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         */
        template : require("ldsh!templates/rad/top/popup"),

        /**
         * レンダリングに利用するオブジェクトを作成する
         *
         * @return {Object}
         */
        serialize : function () {
            return {
                clusterFeature : this.radiationClusterFeature,
                logFeatureCollection : this.radiationLogFeatureCollection
            };
        },

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberOf RadPopupView#
         */
        beforeRendered : function() {
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf RadPopupView#
         */
        afterRendered : function() {
        },

        /**
         * 初期化
         * @memberOf RadPopupView#
         * @param {Object} param
         */
        initialize : function(param) {
            console.assert(param, "param should be given");
            console.assert(param.origin, "origin should be specified");
            console.assert(param.data, "data should be specified");

            this.origin = param.origin;
            this.data = param.data;
            this.radiationClusterFeature = this.data.radiationClusterModel.toGeoJSON();
            this.radiationLogFeatureCollection = this.data.radiationLogCollection.toGeoJSON();

            this.initEvents();

            var coords = this.radiationClusterFeature.geometry.coordinates;
            this.popup = leaflet.popup()
                .setLatLng(
                    new leaflet.LatLng(coords[1], coords[0])
                )
                .setContent(this.getContent());
        },

        /**
         * イベントを初期化する
         * @memberOf RadPopupView#
         */
        initEvents : function() {
            $(this.origin).on("click", this.onClickOrigin.bind(this));
        },

        /**
         * Viewを表示する
         *
         * @memberOf RadPopupView#
         */
        show : function () {
        },

        /**
         * Viewを非表示にする
         *
         * @memberOf RadPopupView#
         */
        hide : function () {
        },

        /**
         * Viewがレンダリングされる先のmapをsetする
         * @memberOf RadPopupView#
         * @param {Leaflet.Map} map
         */
        setMap : function (map) {
            this.map = map;
        },

        /**
         * ポップアップのcontentを取得する
         *
         * @return {String}
         */
        getContent : function () {
            return this.template(this.serialize());
        },

        /**
         * origin要素がクリックされたら呼ばれる
         * @memberOf RadPopupView#
         */
        onClickOrigin : function () {
            var self = this;

            // map自体のクリックイベントが同時に反応して
            // ポップアップが閉じてしまうため
            setTimeout(function () {
                self.popup.openOn(self.map);
            }, 0);
        }
    });

    module.exports = RadPopupView;
});
