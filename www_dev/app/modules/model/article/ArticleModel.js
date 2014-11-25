define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    var DateUtil = require("modules/util/DateUtil");
    var CommonUtil = require("modules/util/CommonUtil");

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
            response.dispUpdatedAt = DateUtil.formatDate(new Date(response.updatedAt),"yyyy年MM月dd日 HH時mm分");
            response.dispSite = CommonUtil.sanitizing(response.site);
            response.dispTitle = CommonUtil.sanitizing(response.title);
            response.dispPlace = CommonUtil.sanitizing(response.place);
            if (response.startDate) {
                if (response.startDate.length > 10) {
                    response.dispStartDate = DateUtil.formatDate(new Date(response.startDate),"yyyy年MM月dd日 HH時mm分");
                } else {
                    response.dispStartDate = DateUtil.formatDate(new Date(response.startDate),"yyyy年MM月dd日");
                }
            }
            response.tagsArray = [];
            response.tagsLabel = "";
            // TODO 記事情報にpublishedAtが登録されるようになったら、このif文ごと削除すること｛
            if (!response.publishedAt) {
                response.publishedAt = DateUtil.formatDate(new Date(),"yyyy-MM-dd");
            }
            // ｝
            
            if (response.tags) {
                var arr = response.tags.split(",");
                _.each(arr,function (tag) {
                    response.tagsArray.push(decodeURIComponent(tag));
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
            saveData.parent = this.get("parent");
            saveData.site = this.get("site");
            saveData.url = this.get("url");
            saveData.link = this.get("link");
            saveData.title = this.get("title");
            saveData.description = this.get("description");
            saveData.rawHTML = this.get("rawHTML");
            saveData.auther = this.get("auther");
            saveData.scraping = this.get("scraping");

            saveData.type = this.get("type");
            saveData.startDate = this.get("startDate");
            saveData.endDate = this.get("endDate");
            saveData.startTime = this.get("startTime");
            saveData.endTime = this.get("endTime");
            saveData.publishedAt = this.get("publishedAt");
            saveData.depublishedAt = this.get("depublishedAt");
            saveData.place = this.get("place");
            saveData.contactInfo = this.get("contactInfo");
            saveData.status = this.get("status");
            saveData.createUserId = this.get("createUserId");
            
            saveData.imageUrl = this.get("imageUrl");
            saveData.imageUrl2 = this.get("imageUrl2");
            saveData.imageUrl3 = this.get("imageUrl3");
            
            saveData.imageComment = this.get("imageComment");
            saveData.imageComment2 = this.get("imageComment2");
            saveData.imageComment3 = this.get("imageComment3");
            // タグ文字列の生成
            var tags ="";
            if (this.get("tagsArray") && this.get("tagsArray").length) {
                _.each(this.get("tagsArray"),function (tag) {
                    if (!tags) {
                        tags = encodeURIComponent(tag);
                    } else {
                        tags += "," + encodeURIComponent(tag);
                    }
                });
            }
            saveData.tags = tags;
        }

    });

    module.exports = ArticleModel;
});
