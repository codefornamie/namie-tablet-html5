define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var moment = require("moment");
    var AbstractModel = require("modules/model/AbstractModel");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var DateUtil = require("modules/util/DateUtil");
    var CommonUtil = require("modules/util/CommonUtil");

    /**
     * 記事情報のモデルクラスを作成する。
     *
     * @class 記事情報のモデルクラス
     * @exports BacknumberModel
     * @constructor
     */
    var BacknumberModel = AbstractModel.extend({
        /**
         * モデルの初期値を返す
         *
         * @return {Object}
         */
        defaults: function () {
            return {
                articleTitle: ["", "", ""],
            };
        },

        /**
         * 初期化処理
         */
        initialize: function (attr, param) {
            console.assert(param.date, "Should set param.date");
            
            this.setDate(moment(param.date));
            this.updateArticle();
        },
        
        /**
         * 日付を設定する
         * @param {moment} date
         */
        setDate: function (date) {
            this.date = date;
        },
        
        /**
         * このmodelの情報を更新する
         */
        updateArticle: function () {
            var self = this;
            var col = new ArticleCollection();
            
            col.setSearchCondition({
                targetDate: this.date.toDate()
            });
            
            this.fetchArticleCollection(col, function (err, res) {
                if (err) {
                    return console.error(err);
                }

                // おすすめ記事の分を先頭にした記事モデルの配列（先頭の3件を使用）
                var articleModels = [];

                // おすすめ記事を検索
                var targetDate = self.date.format("YYYY-MM-DD");
                var recommendArticle = res.find(function(article) {
                    return article.get("isRecommend") === "true" && article.get("publishedAt") === targetDate;
                });

                // おすすめ記事があれば先頭に追加
                if (recommendArticle) {
                    articleModels.push(recommendArticle);
                }

                // おすすめ記事以外の記事を追加
                res.each(function(articleModel) {
                    if (articleModel != recommendArticle) {
                        articleModels.push(articleModel);
                    }
                });

                // 結果を格納
                self.set({
                    createdAt: self.date.toDate(),
                    articleTitle: [
                        articleModels[0] ? (articleModels[0].get("isRecommend") ? "[おすすめ]" : "") + articleModels[0].get("dispTitle") : "",
                        articleModels[1] ? articleModels[1].get("dispTitle") : "",
                        articleModels[2] ? articleModels[2].get("dispTitle") : ""
                    ],
                    imageUrl: articleModels[0] ? articleModels[0].get("imageUrl") : null,
                    isPIOImage: articleModels[0] ? articleModels[0].isPIOImage() : false
                });

                self.trigger("change");
                self.trigger("fetched");
            });
        },

        /**
         * articleを読み込む
         * @param {Backbone.Collection} col
         * @param {Function} callback
         * @memberof BacknumberModel#
         */
        fetchArticleCollection : function(col, callback) {
            col.fetch({
                success : function(res) {
                    callback(null, res);
                },

                error : function onErrorLoadArticle() {
                    callback('err');
                }
            });
        },

        
        /**
         * createdAtをYYYY-MM-DDの文字列にして返す
         *
         * @return {String}
         */
        generateDateString: function () {
            var d = new Date(this.get('createdAt'));
            var dateString = DateUtil.formatDate(d, 'yyyy-MM-dd');

            return dateString;
        },

        /**
         * createdAtの年・月・日・曜日要素を文字列にして返す
         *
         * @param {String} 取得する要素の名前（"year", "month", "day", "weekday"）
         * @return {Object}
         */
        generateDateElementString: function (name) {
            var d = new Date(this.get('createdAt'));
            var format = "";

            switch(name) {
            case "year": format = "yyyy"; break;
            case "month": format = "MM"; break;
            case "day": format = "dd"; break;
            case "weekday": format = "ddd"; break;
            }

            return DateUtil.formatDate(d, format);
        }
    });

    module.exports = BacknumberModel;
});
