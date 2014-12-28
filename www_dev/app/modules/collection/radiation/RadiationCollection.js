define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var RadiationModel = require("modules/model/radiation/RadiationModel");

    /**
     * 放射線量データのコレクションクラス
     * @class 放射線量データのコレクションクラス
     * @exports RadiationCollection
     * @constructor
     */
    var RadiationCollection = AbstractODataCollection.extend({
        model : RadiationModel,
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
         * @memberOf RadiationCollection#
         */
        parseOData: function (response, options) {
            return response;
        }
    });

    module.exports = RadiationCollection;
});
