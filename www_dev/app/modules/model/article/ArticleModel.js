/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractUserScriptModel = require("modules/model/AbstractUserScriptModel");
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
    var ArticleModel = AbstractUserScriptModel.extend({
        serviceName: 'article',
        entity : "article",

        /**
         * 取得したOData情報のparse処理を行う。
         * <p>
         * サブクラスは、本メソッドをオーバライドして、取得した情報のparse処理を実装する。
         * </p>
         * @param {Object} response レスポンス情報
         * @param {Object} options オプション情報
         * @return {Object} パース後の情報
         * @memberOf ArticleModel#
         */
        parseOData : function(response, options) {
            response.dispCreatedAt = DateUtil.formatDate(new Date(response.createdAt), "yyyy年MM月dd日 HH時mm分");
            response.dispUpdatedAt = DateUtil.formatDate(new Date(response.updatedAt), "yyyy年MM月dd日 HH時mm分");
            response.dispSite = CommonUtil.sanitizing(response.site);
            if (!response.title && response.description) {
                // 写真投稿などのタイトルがないものは本文の先頭10文字をタイトルとする
                response.title = response.description.substr(0, 10);
                if (response.description.length > 10) {
                    response.title += "...";
                }
            }
            response.dispTitle = CommonUtil.sanitizing(response.title);
            response.dispPlace = CommonUtil.sanitizing(response.place);
            response.dispDescription = CommonUtil.sanitizing(response.description);
            
                // URL文字列をアンカーに置き換える
            response.dispDescription = CommonUtil.replaceURLtoAnchor(response.dispDescription);
            response.dispRawHTML = CommonUtil.replaceURLtoAnchor(response.rawHTML);
            response.dispRawHTML2 = CommonUtil.replaceURLtoAnchor(response.rawHTML2);
            response.dispRawHTML3 = CommonUtil.replaceURLtoAnchor(response.rawHTML3);
            
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

            // 並び順JSON文字列を配列に変換
            var seqArray = [];
            if (response.sequence) {
                if (!isNaN(parseInt(response.sequence))) {
                    // 掲載期間中表示対応前のデータのコンバート
                    var seqObj = {};
                    seqObj[response.publishedAt] = response.sequence;
                    seqArray.push(seqObj);
                } else if (typeof response.sequence === "string") {
                    // sequenceがオブジェクト型でない場合
                    seqArray = JSON.parse(response.sequence);
                } else {
                    // すでにparse処理を一度通っている場合
                    seqArray = response.sequence;
                }
            }
            response.sequence = seqArray;

            if (response.dispDescription && response.dispDescription.length > 50) {
                // 記事が100文字以上の場合、50文字に切り取り
                response.dispDescriptionSummary = response.dispDescription.substring(0, 50) + " ...";
            } else {
                response.dispDescriptionSummary = response.dispDescription;
            }

            // サムネイルがないデータは、本画像をサムネイルとする。
            response.imageThumbUrl = response.imageThumbUrl || response.imageUrl;

            return response;
        },
        /**
         * モデル固有の永続化データを生成する。
         * <p>
         * サブクラスは、本メソッドをオーバライドして、 永続化するデータを生成する処理を実装する。
         * </p>
         * @param {Object} saveData 永続化データ
         * @memberOf ArticleModel#
         */
        makeSaveData : function(saveData) {
            saveData.parent = this.get("parent");
            saveData.site = this.get("site");
            saveData.url = this.get("url");
            saveData.link = this.get("link");
            saveData.title = this.get("title");
            saveData.description = this.get("description");
            saveData.rawHTML = this.get("rawHTML");
            saveData.rawHTML2 = this.get("rawHTML2");
            saveData.rawHTML3 = this.get("rawHTML3");
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

            saveData.imagePath = this.get("imagePath");
            saveData.imageUrl = this.get("imageUrl");
            saveData.imageUrl2 = this.get("imageUrl2");
            saveData.imageUrl3 = this.get("imageUrl3");
            saveData.imageThumbUrl = this.get("imageThumbUrl");

            saveData.imageComment = this.get("imageComment");
            saveData.imageComment2 = this.get("imageComment2");
            saveData.imageComment3 = this.get("imageComment3");

            saveData.isRecommend = this.get("isRecommend");
            saveData.isDepublish = this.get("isDepublish");

            saveData.nickname = this.get("nickname");

            saveData.sequence = JSON.stringify(this.get("sequence"));
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
         * @return {String} イベントのステータス文字
         * @memberOf ArticleModel#
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
         * @return {String}
         * @memberOf ArticleModel#
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
         * @return {String}
         * @memberOf ArticleModel#
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
         * @return {String}
         * @memberOf ArticleModel#
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
         * @memberOf ArticleModel#
         */
        isPIOImage : function() {
            // 記事タイプが1 or 2 の場合、imageUrlの画像がインターネットの画像
            // それ以外は、personium.io の画像
            if (this.get("type") === "1" || this.get("type") === "2") {
                return false;
            } else {
                return true;
            }
        },

        /**
         * 画像タイプを判定する
         * @return {Number} Code.IMAGE_TYPE_* を返す
         * @memberOf ArticleModel#
         */
        getImageType : function() {
            if (this.isPIOImage()) {
                return Code.IMAGE_TYPE_PIO;
            }

            if (!_.isEmpty(this.get("imageUrl"))) {
                return Code.IMAGE_TYPE_URL;
            }

            return Code.IMAGE_TYPE_NONE;
        },

        /**
         * この記事のサムネイル画像タイプを判定する。
         * @return {Number} Code.IMAGE_TYPE_* を返す
         * @memberOf ArticleModel#
         */
        getThumbImageType : function() {
            var url = this.get("imageThumbUrl");
            if (!url) {
                return Code.IMAGE_TYPE_NONE;
            } else if (url.lastIndexOf("http://", 0) === 0 || url.lastIndexOf("https://", 0) === 0) {
                return Code.IMAGE_TYPE_URL;
            } else {
                return Code.IMAGE_TYPE_PIO;
            }
        },

        /**
         * 情報源タイプを判定する
         * @return {string} class文字列を返す
         * @memberOf ArticleModel#
         */
        getSiteType : function() {
            var dispSite = this.getCategory();
            var articleSite = null;

            articleSite = _.find(Code.ARTICLE_SITE_LIST, function(item) {
                return item.key == dispSite;
            });

            if (articleSite) {
                return articleSite.value;
            } else {
                return Code.ARTICLE_SITE_NONE;
            }
        },
        /**
         * この記事のカテゴリ表示制御オブジェクトを返す。
         * @returns この記事のカテゴリ表示制御オブジェクト
         * @memberOf ArticleModel#
         */
        getCategoryObj : function() {
            var self = this;
            var categoryConf = _.find(app.serverConfig.COLOR_LABEL, function(category) {
                return category.type === self.get("type") && category.site === self.get("site");
            });
            return categoryConf;
        },
        /**
         * 新聞紙面の記事に付くカテゴリ名を返す。
         * @returns この記事のカテゴリ名
         * @memberOf ArticleModel#
         */
        getCategory : function() {
            var categoryConf = this.getCategoryObj();
            if (categoryConf) {
                return categoryConf.label;
            } else {
                return this.get("site");
            }
        },
        /**
         * 新聞紙面の記事に付くカテゴリ名のCSSクラス名を返す。
         * @returns この記事に付くカテゴリ名のCSSクラス名
         * @memberOf ArticleModel#
         */
        getCssClass : function() {
            var categoryConf = this.getCategoryObj();
            if (categoryConf) {
                return "article-label--category" + categoryConf.id || "";
            }
            return "";
        },
        /**
         * 新聞紙面の記事に付くカテゴリ名の色を返す。
         * @returns この記事に付くカテゴリ名のカラー名またはカラーコード
         * @memberOf ArticleModel#
         */
        getColor : function() {
            var categoryConf = this.getCategoryObj();
            if (categoryConf) {
                return categoryConf.color;
            }
            return null;
        },
        /**
         * この記事の公開期限が切れているかチェックする。
         * @returns {Boolean} 公開期限が過ぎている場合に<code>true</code>を返却する
         * @memberOf ArticleModel#
         */
        isExpired : function() {
            if (!this.get("period")) {
                return false;
            }
            var publishedAt = Date.parse(this.get("publishedAt")).getTime();

            var now = (new Date()).getTime();

            var period = this.get("period") * 86400000;
            if (now > publishedAt + period) {
                return true;
            }
            return false;
        },
        /**
         * この記事の本文に対して、クローラーが"minpo"スクレイピングを実施しているかどうかを判定する。
         * <p>
         * クローラーが"minpo"スクレイピングを実施している場合、,<code>true</code>を返却する。<br>
         * その場合、この記事のrawHTMLプロパティ内のimg要素のsrc属性には、personium.ioのWebDAVの画像ファイルパスが設定されていることを示す。
         * </p>
         * @returns {Boolean} クローラーが"minpo"スクレイピングを実施している場合、,<code>true</code>を返却する
         * @memberOf ArticleModel#
         */
        isMinpoScraping : function() {
            var scrapingConfig = _.find(Code.MINPO_SCRAPING, function(scrapingConfig) {
                return scrapingConfig.site === this.get("site");
            }.bind(this));
            return scrapingConfig && scrapingConfig.scraping === "minpo";
        }
    });

    module.exports = ArticleModel;
});
