define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    var DateUtil = require("modules/util/DateUtil");

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
            response.dispCreatedAt = DateUtil.formatDate(new Date(response.createdAt),"yyyy年MM月dd日 HH時mm分");
            response.tagsArray = [];
            response.tagsLabel = "";
            if (response.tags) {
                var arr = response.tags.split(",");
                _.each(arr,function (tag) {
                    response.tagsArray.push(unescape(tag));
                });
            }

            return response;
        },
        /**
         * モデル固有の永続化データを生成する。
         * <p>
         * サブクラスは、本メソッドをオーバライドして、 永続化するデータを生成する処理を実装する。
         * </p>
         */
        makeSaveData : function(saveData) {
            saveData.site = this.get("site");
            saveData.url = this.get("url");
            saveData.link = this.get("link");
            saveData.createdAt = this.get("createdAt");
            saveData.updatedAt = this.get("updatedAt");
            saveData.deletedAt = this.get("deletedAt");
            saveData.title = this.get("title");
            saveData.description = this.get("description");
            saveData.rawHTML = this.get("rawHTML");
            saveData.auther = this.get("auther");
            saveData.scraping = this.get("scraping");
            saveData.imageUrl = this.get("imageUrl");
            
            // タグ文字列の生成
            var tags ="";
            if (this.get("tagsArray").length) {
                _.each(this.get("tagsArray"),function (tag) {
                    if (!tags) {
                        tags = escape(tag);
                    } else {
                        tags += "," + escape(tag);
                    }
                });
            }
            saveData.tags = tags;
        }

    });

    module.exports = ArticleModel;
});
