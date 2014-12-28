define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var ArticleModel = require("modules/model/article/ArticleModel");

    /**
     * おすすめ情報のモデルクラスを作成する。
     * 
     * @class おすすめ情報のモデルクラス
     * @exports RecommendModel
     * @constructor
     */
    var RecommendModel = ArticleModel.extend({
        entity : "recommend",
        /**
         * 取得したOData情報のparse処理を行う。
         * @param {Object} response レスポンス情報
         * @param {Object} options オプション情報
         * @return {Object} パース後の情報
         * @memberOf RecommendModel#
         */
        parseOData : function(response, options) {
            response.isMine = response.userId === app.user.get("__id");
            return response;
        },
        /**
         * モデル固有の永続化データを生成する。
         * @param {Object} saveData 永続化データ
         * @memberOf RecommendModel#
         */
        makeSaveData : function(saveData) {
            saveData.source = this.get("source");
            saveData.userId = this.get("userId");
            saveData.publishedAt = this.get("publishedAt");
            saveData.depublishedAt = this.get("depublishedAt");
        }

    });

    module.exports = RecommendModel;
});
