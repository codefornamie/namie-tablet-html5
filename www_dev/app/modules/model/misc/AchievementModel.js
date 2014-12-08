define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");

    /**
     * 達成情報のモデルクラスを作成する。
     * 
     * @class 達成情報のモデルクラス
     * @exports AchievementModel
     * @constructor
     */
    var AchievementModel = AbstractODataModel.extend({
        entity : "achievement",
        /**
         * 取得したOData情報のparse処理を行う。
         * 
         * @memberof AchievementModel#
         * @return {Object} パース後の情報
         */
        parseOData : function(response, options) {
            return response;
        },
        /**
         * モデル固有の永続化データを生成する。
         * 
         * @memberof AchievementModel#
         */
        makeSaveData : function(saveData) {
            saveData.userId = app.user.get("__id");
            // TODO 現在のところ0固定。同世帯内の人物を区別したい要望が来た場合に正しく実装
            saveData.memberId = "0";
            saveData.type = this.get("type");
            saveData.action = this.get("action");
            saveData.count = this.get("count");
            saveData.lastActionDate = this.get("lastActionDate");
        },
    });

    module.exports = AchievementModel;
});