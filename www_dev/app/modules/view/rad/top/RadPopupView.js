define(function(require, exports, module) {
    "use strict";

    var moment = require("moment");
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
         * @memberOf RadPopupView#
         * @return {Object}
         */
        serialize : function () {
            var clusterFeature = this.radiationClusterFeature;
            var logFeatureCollection = this.radiationLogFeatureCollection;
            var logFeature = this.radiationLogFeature;

            var hasCollection = !!logFeatureCollection;
            var date, dateStr, avg, max;
            var stationType, numSample, sensorVendor, sensorModel, sensorSerialNo;

            if (hasCollection) {
                date = moment(clusterFeature.properties.startDate);
                dateStr = date.format("YYYY年 M/D(ddd)");
                avg = logFeatureCollection.features.reduce(function (total, feature) {
                    return total + feature.properties.value;
                }, 0) / logFeatureCollection.features.length;
                max = _.max(logFeatureCollection.features, function (feature) {
                    return feature.properties.value;
                }).properties.value;

                // 小数点以下3桁に丸める
                avg = Math.round(avg * 1000) / 1000;
            } else {
                date = moment(logFeature.properties.date);
                dateStr = date.format("YYYY年 M/D(ddd) H時mm分");
                avg = logFeature.properties.value;
                max = logFeature.properties.value;
            }

            stationType = clusterFeature.properties.isFixedStation ? "固定局" : "移動局";
            numSample = clusterFeature.properties.numSample;
            sensorVendor = clusterFeature.properties.sensorVendor;
            sensorModel = clusterFeature.properties.sensorModel;
            sensorSerialNo = clusterFeature.properties.sensorSerialNo;

            return {
                data : {
                    dateStr : dateStr,
                    avg : avg,
                    max : max,
                    stationType : stationType,
                    numSample : numSample,
                    sensorVendor : sensorVendor,
                    sensorModel : sensorModel,
                    sensorSerialNo : sensorSerialNo
                }
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
            console.assert(param.position, "position should be specified");
            console.assert(param.data, "data should be specified");

            this.position = param.position;
            this.data = param.data;
            this.radiationClusterModel = this.data.radiationClusterModel;
            this.radiationClusterFeature = this.data.radiationClusterFeature;
            this.radiationLogFeatureCollection = this.data.radiationLogFeatureCollection;
            this.radiationLogFeature = this.data.radiationLogFeature;

            this.initEvents();

            this.popup = leaflet.popup()
                .setLatLng(this.position)
                .setContent(this.getContent());
        },

        /**
         * イベントを初期化する
         * @memberOf RadPopupView#
         */
        initEvents : function() {
            this.listenTo(this.radiationClusterModel, "change:hidden", this.onChangeClusterModel);
        },

        /**
         * Viewを表示する
         *
         * @memberOf RadPopupView#
         */
        show : function () {
            this.popup.openOn(this.map);
        },

        /**
         * Viewを非表示にする
         *
         * @memberOf RadPopupView#
         */
        hide : function () {
            this.map.closePopup(this.popup);
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
         * @memberOf RadPopupView#
         * @return {String}
         */
        getContent : function () {
            return this.template(this.serialize());
        },

        /**
         * radiationClusterModelが変更されたら呼ばれる
         * @memberOf RadPopupView#
         */
        onChangeClusterModel : function () {
            var isHidden = this.radiationClusterModel.get("hidden");

            if (isHidden) {
                this.hide();
            }
        },

        /**
         * origin要素がクリックされたら呼ばれる
         * @memberOf RadPopupView#
         */
        onClickOrigin : function () {
        }
    });

    module.exports = RadPopupView;
});
