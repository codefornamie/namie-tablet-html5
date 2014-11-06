define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    var DateUtil = require("modules/util/DateUtil");
    var CommonUtil = require("modules/util/CommonUtil");
    /**
     * イベント情報のモデルクラスを作成する。
     * 
     * @class イベント情報のモデルクラス
     * @exports EventsModel
     * @constructor
     */
    var EventsModel = AbstractODataModel.extend({
        entity : "event",
        /**
         * 取得したOData情報のparse処理を行う。
         * 
         * @return {Object} パース後の情報
         */
        parseOData : function(response, options) {
            response.isNotArticle = true;
            response.modelType = "event";

            response.dispSite = "イベント";
            response.dispTitle = CommonUtil.sanitizing(response.eventName);
            var eventDateTime = new Date(response.eventDate + "T" + response.eventTime);
            response.dispDate = DateUtil.formatDate(eventDateTime,"yyyy年MM月dd日 HH時mm分");
            response.dispPlace = response.eventPlace;
            response.dispTel = response.eventTel;
            response.dispEmail = response.eventEmail;
            response.description = CommonUtil.sanitizing(response.eventDetail);
            response.dispCreatedAt = DateUtil.formatDate(new Date(response.createdAt),"yyyy年MM月dd日 HH時mm分");
            response.tagsArray = [];
            response.tagsArray.push("イベント");
            return response;
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
            saveData.fileName = this.get("fileName");
        }

    });

    module.exports = EventsModel;
});
