define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    /**
     * イベント情報のモデルクラスを作成する。
     * 
     * @class イベント情報のモデルクラス
     * @exports EventsModel
     * @constructor
     */
    var EventsModel = AbstractODataModel.extend({
        /**
         * 取得したOData情報のparse処理を行う。
         * <p>
         * サブクラスは、本メソッドをオーバライドして、取得した情報のparse処理を実装する。
         * </p>
         * 
         * @return {Object} パース後の情報
         */
        parseOData : function(response, options) {
            return {};
        },
        /**
         * モデル固有の永続化データを生成する。
         * <p>
         * サブクラスは、本メソッドをオーバライドして、 永続化するデータを生成する処理を実装する。
         * </p>
         */
        makeSaveData : function(saveData) {
            if (this.get("eventDate")) {
                this.get("eventDate").replace("-","/");
            }
            saveData.eventDate = this.get("eventDate");
            saveData.eventTime = this.get("eventTime");
            saveData.eventName = this.get("eventName");
            saveData.eventPlace = this.get("eventPlace");
            saveData.eventDetail = this.get("eventDetail");
            saveData.eventTel = this.get("eventTel");
            saveData.eventEmail = this.get("eventEmail");
        }

    });

    module.exports = EventsModel;
});
