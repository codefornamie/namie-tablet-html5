define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");

    /**
     * 記事情報のモデルクラスを作成する。
     * 
     * @class 記事情報のモデルクラス
     * @exports EventsModel
     * @constructor
     */
    var ArticleModel = AbstractODataModel.extend({
        entity : "article",
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
            // テストデータ登録用
//            saveData.site = this.get("site");
//            saveData.url = this.get("url");
//            saveData.link = this.get("link");
//            saveData.createdAt = this.get("createdAt");
//            saveData.updatedAt = this.get("updatedAt");
//            saveData.deletedAt = this.get("deletedAt");
//            saveData.title = this.get("title");
//            saveData.description = this.get("description");
//            saveData.auther = this.get("auther");
//            saveData.scraping = this.get("scraping");
//            saveData.imageUrl = "http://www.minpo.jp/common/news/localnews/2014102318808-2.jpg";
        }

    });

    module.exports = ArticleModel;
});
