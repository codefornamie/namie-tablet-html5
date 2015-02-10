define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var RadiationLogModel = require("modules/model/radiation/RadiationLogModel");

    /**
     * 放射線量データのコレクションクラス
     * @class 放射線量データのコレクションクラス
     * @exports RadiationLogCollection
     * @constructor
     */
    var RadiationLogCollection = AbstractODataCollection.extend({
        model : RadiationLogModel,
        entity : "radiation",
        condition : {
            top : 1,
            orderby : "dateTime desc",
            filter : "station eq '浪江町役場'"
        },
        /**
         * 配列をマップに変換する。
         * 
         * @param {Object} レスポンス情報
         * @param {Object} オプション
         * @return {Objecy} レスポンス情報
         * @memberOf RadiationLogCollection#
         */
        parseOData: function (response, options) {
            var res = response.map(function (log) {
                return _.extend({
                    latitude : log.latitude / Math.pow(10, 6),
                    longitude : log.longitude / Math.pow(10, 6),
                    altitude : log.altitude / Math.pow(10, 3),
                    value : log.value / Math.pow(10, 3)
                });
            });

            return res;
        },

        // TODO: 開発用サーバにデータが入ったらこのメソッドは削除する
        /**
         * 開発用サーバにデータが無いのでダミーのsyncを利用する
         *
         * @return {undefined}
         */
        sync : function (method, collection, opt) {
            var self = this;
            var URL_DUMMY_JSON = "http://www.json-generator.com/api/json/get/cpWhdqdeXm";

            if (method === "read") {
                collection.trigger("request", collection, null, opt);

                return $.get(URL_DUMMY_JSON).done(function (data) {
                    data.forEach(function (log) {
                        log.latitude = 35 * Math.pow(10, 6) + Math.random() * 5 * Math.pow(10, 6)
                        log.longitude = 135 * Math.pow(10, 6) + Math.random() * 5 * Math.pow(10, 6)
                    });

                    self.set(self.parseOData(data));
                    self.trigger("sync", self, data, opt);
                });
            } else {
                return AbstractODataCollection.prototype.sync.apply(this, arguments);
            }
        },

        /**
         * GeoJSON形式に変換する。
         * @return {Object}
         * @memberOf RadiationLogCollection#
         */
        toGeoJSON : function() {
            var geoJSON;
            var features = [];

            this.each(function(model) {
                features.push(model.toGeoJSON());
            });

            geoJSON = {
                    "type": "FeatureCollection",
                    "features": features
            };

            return geoJSON;
        }
    });

    module.exports = RadiationLogCollection;
});
