define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");

    /**
     * 放射線量データのモデルクラスを作成する。
     *
     * @class 放射線量データのモデルクラス
     * @exports EventsModel
     * @constructor
     */
    var RadiationModel = AbstractODataModel.extend({
        entity : "radiation",

        /**
         * 取得したOData情報のparse処理を行う。
         * @param {Object} response レスポンス情報
         * @param {Object} options オプション情報
         * @return {Object} パース後の情報
         * @memberof RadiationModel#
         */
        parseOData : function(response, options) {
            return response;
        },
        /**
         * モデル固有の永続化データを生成する。
         * @param {Object} saveData 永続化データ
         * @memberof RadiationModel#
         */
        makeSaveData : function(saveData) {
        }

    });

    module.exports = RadiationModel;
});
