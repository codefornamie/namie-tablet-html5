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
         * @return {Object} パース後の情報
         */
        parseOData : function(response, options) {
            return response;
        },
        /**
         * モデル固有の永続化データを生成する。
         */
        makeSaveData : function(saveData) {
        }

    });

    module.exports = RadiationModel;
});