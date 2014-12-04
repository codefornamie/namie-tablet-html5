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
            // [TODO]
            // ダミーデータを入れているので
            // 正式なデータ取得処理に置き換えるべき
            return {
                createdAt: new Date(2014, 10, 28),
                articleTitle: [
                    "長いダミーテキストです。長いダミーテキストです。長いダミーテキストです。長いダミーテキストです。長いダミーテキストです。長いダミーテキストです。",
                    "広野町「道の駅」整備へ 防災、復興の拠点に",
                    "今日のレシピ 「豚の角煮」"
                ],
                thumbnail: "app/img/dummy-manga.png"
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

                console.log(self.date);
                console.log(res);
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
