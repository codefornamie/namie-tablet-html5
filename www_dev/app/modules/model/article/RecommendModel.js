define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    /**
     * おすすめ情報のモデルクラスを作成する。
     * 
     * @class おすすめ情報のモデルクラス
     * @exports RecommendModel
     * @constructor
     */
    var RecommendModel = AbstractODataModel.extend({
        entity : "recommend",
        /**
         * 取得したOData情報のparse処理を行う。
         * 
         * @return {Object} パース後の情報
         */
        parseOData : function(response, options) {
            response.isMine = response.userId === app.user.id;
            return response;
        },
        /**
         * モデル固有の永続化データを生成する。
         */
        makeSaveData : function(saveData) {
            saveData.source = this.get("source");
            saveData.userId = this.get("userId");
            saveData.publishedAt = this.get("publishedAt");
        }

    });

    module.exports = RecommendModel;
});
