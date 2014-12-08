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
        },
    });

    module.exports = AchievementModel;
});