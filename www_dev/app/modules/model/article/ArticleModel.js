define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataModel = require("modules/model/AbstractODataModel");
    var DateUtil = require("modules/util/DateUtil");
    var BusinessUtil = require("modules/util/BusinessUtil");
    var CommonUtil = require("modules/util/CommonUtil");
    var Code = require("modules/util/Code");

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
            response.dispCreatedAt = DateUtil.formatDate(new Date(response.createdAt), "yyyy年MM月dd日 HH時mm分");
            response.dispUpdatedAt = DateUtil.formatDate(new Date(response.updatedAt), "yyyy年MM月dd日 HH時mm分");
            response.dispSite = CommonUtil.sanitizing(response.site);
            response.dispTitle = CommonUtil.sanitizing(response.title);
            response.dispPlace = CommonUtil.sanitizing(response.place);
            response.dispDescription = CommonUtil.sanitizing(response.description);
            response.dispContactInfo = CommonUtil.sanitizing(response.contactInfo);
            if (response.startDate) {
                if (response.startDate.length > 10) {
                    response.dispStartDate = DateUtil.formatDate(new Date(response.startDate), "yyyy年MM月dd日 HH時mm分");
                } else {
                    response.dispStartDate = DateUtil.formatDate(new Date(response.startDate), "yyyy年MM月dd日");
                }
            }
            response.tagsArray = [];
            response.tagsLabel = "";
            // TODO 記事情報にpublishedAtが登録されるようになったら、このif文ごと削除すること｛
            if (!response.publishedAt) {
                response.publishedAt = DateUtil.formatDate(new Date(), "yyyy-MM-dd");
            }
            // ｝

            if (response.tags) {
                var arr = response.tags.split(",");
                _.each(arr, function(tag) {
                    response.tagsArray.push(decodeURIComponent(tag));
                });
            }

            if (response.dispDescription && response.dispDescription.length > 50) {
                // 記事が100文字以上の場合、50文字に切り取り
                response.dispDescriptionSummary = response.dispDescription.substring(0, 50) + " ...";
            } else {
                response.dispDescriptionSummary = response.dispDescription;
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
            saveData.isDepublish = this.get("isDepublish");
            saveData.isRecomend = this.get("isRecomend");
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

            saveData.isRecommend = this.get("isRecommend");
            saveData.isDepublish = this.get("isDepublish");
            // タグ文字列の生成
            var tags = "";
            if (this.get("tagsArray") && this.get("tagsArray").length) {
                _.each(this.get("tagsArray"), function(tag) {
                    if (!tags) {
                        tags = encodeURIComponent(tag);
                    } else {
                        tags += "," + encodeURIComponent(tag);
                    }
                });
            }
            saveData.tags = tags;
        },

        /**
         * 「掲載中」などのイベントのステータス文字列を返す
         *
         * @return {String}
         */
        getStatusString : function() {
            if (this.get("isDepublish")) {
                return Code.ARTICLE_STATUS_DEPUBLISHED;
            }
            
            var currentPubDate = DateUtil.formatDate(BusinessUtil.getCurrentPublishDate(), "yyyy-MM-dd");
            if (currentPubDate > new Date(this.get("publishedAt"))) {
                return Code.ARTICLE_STATUS_PUBLISHED;
            } else {
                return Code.ARTICLE_STATUS_BEFORE_PUBLISH;
            }
        },

        /**
         * 掲載期間の文字列を返す
         *
         * @return {String}
         */
        getPubDateString : function() {
            var pubDateString = DateUtil.formatDate(new Date(this.get("publishedAt")), "yyyy年MM月dd日(ddd)");

            if (this.get("depublishedAt")) {
                pubDateString += " ～ " + DateUtil.formatDate(new Date(this.get("depublishedAt")), "yyyy年MM月dd日(ddd)");
            }

            return pubDateString;
        },

        /**
         * 更新日の文字列を返す
         *
         * @return {String}
         */
        getUpdatedString : function() {
            var updatedString = DateUtil.formatDate(new Date(this.get("updatedAt")), "yyyy年MM月dd日(ddd)");
            if (!updatedString) {
                updatedString = DateUtil.formatDate(new Date(this.get("createdAt")), "yyyy年MM月dd日(ddd)");
            }
            return updatedString;
        },

        /**
         * 日付文字列を返す
         *
         * @return {String}
         */
        getDateString : function() {
            // 日時
            var dateString = DateUtil.formatDate(new Date(this.get("startDate")), "yyyy年MM月dd日(ddd)");
            if (this.get("endDate")) {
                dateString += " ～ " + DateUtil.formatDate(new Date(this.get("endDate")), "yyyy年MM月dd日(ddd)");
            }
            var st = this.get("startTime");
            st = st ? st : "";
            var et = this.get("endTime");
            et = et ? et : "";
            if (st || et) {
                dateString += "\n" + st + " ～ " + et;
            }
            return CommonUtil.sanitizing(dateString);
        },
        /**
         * この記事の画像がpersonium.ioに保存されている画像かどうかを判定する。
         * @return {Boolean} personium.ioに保存されている画像の場合、<code>true</code>を返す。
         * @memberof ArticleModel#
         */
        isPIOImage: function() {
            // 記事タイプが1 or 2 の場合、imageUrlの画像がインターネットの画像
            // それ以外は、personium.io の画像
            if (this.get("type") === "1" || this.get("type") === "2") {
                return false;
            } else {
                return true;
            }
        }
    });

    module.exports = ArticleModel;
});
