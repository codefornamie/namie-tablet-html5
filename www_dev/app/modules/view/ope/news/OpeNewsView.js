define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var colorbox = require("colorbox");
    var DateUtil = require("modules/util/DateUtil");
    var NewsView = require("modules/view/news/NewsView");
    var OpeFeedListView = require("modules/view/ope/news/OpeFeedListView");
    var OpeFeedListItemView = require("modules/view/ope/news/OpeFeedListItemView");
    var OpeNewsPreviewView = require("modules/view/ope/news/OpeNewsPreviewView");

    var Equal = require("modules/util/filter/Equal");
    /**
     * 運用管理アプリの記事一覧画面を表示するためのViewクラスを作成する。
     * 
     * @class 運用管理アプリの記事一覧画面を表示するためのView
     * @exports OpeNewsView
     * @constructor
     */
    var OpeNewsView = NewsView.extend({
        /**
         * 記事一覧を表示する要素のセレクタ
         * @memberof OpeNewsView#
         */
        feedListElement : '#article_list',
        /**
         * このViewのイベント
         * @memberof OpeNewsView#
         */
        events : {
            "click [data-article-register-button]" : "onClickArticleRegisterButton",
            "click [data-article-preview-button]" : "onClickArticlePreviewButton"
        },
        
        /**
         * ビューの初期化を行う。
         * @memberof OpeNewsView#
         * @param {Object} options ビューのオプション
         */
        initialize : function(options) {
            options = options || {};

            this.targetDate = this.targetDate || options.date;

            this.setArticleSearchCondition({
                targetDate : new Date(this.targetDate)
            });

            this.initEvents();
        },

        /**
         * 表示する日付を設定する。
         * @memberof OpeNewsView#
         * @param {Date} targetDate 表示する日付。
         */
        setDate : function(targetDate) {
            this.targetDate = targetDate;
            this.$el.find("#targetDate").text(
                    DateUtil.formatDate(targetDate, "yyyy年MM月dd日") + app.config.PUBLISH_TIME);

            this.setArticleSearchCondition({
                targetDate : targetDate
            });
            this.searchArticles();
        },

        /**
         * 記事の検索条件を指定する。
         * @param {Object} 検索条件。現在、targetDateプロパティにDateオブジェクトを指定可能。
         * @memberof OpeNewsView#
         */
        setArticleSearchCondition : function(condition) {
            var targetDate = condition.targetDate;
            var dateString = DateUtil.formatDate(targetDate, "yyyy-MM-dd");
            this.articleCollection.condition.filters = [
                                                        new Equal("publishedAt", dateString)
                                                                ];
        },
        /**
         * 左ペインの記事一覧メニューを表示する。
         * @memberof OpeNewsView#
         */
        showArticleListView : function() {
            return;
        },
        /**
         * 右ペインの記事一覧を表示するViewのインスタンスを作成して返す。
         * <p>
         * 運用管理ツール用の記事一覧表示処理を行うため、OpeFeedListViewの
         * インスタンスを生成するようにオーバライドする。
         * </p>
         * @return {OpeFeedListView} 生成したOpeFeedListViewのインスタンス
         * @memberof OpeNewsView#
         */
        createGridListView: function() {
            return this.createFeedListView();
        },
        /**
         * 記事一覧を表示するViewのインスタンスを作成して返す。
         * @return {FeedListView} 生成したFeedListViewのインスタンス
         * @memberof OpeNewsView#
         */
        createFeedListView : function() {
            if (this.notFoundMessage) {
                this.notFoundMessage.hide("slow");
            }
            var listView = new OpeFeedListView();
            listView.targetDate = this.targetDate;
            listView.setFeedListItemViewClass(OpeFeedListItemView);
            return listView;
        },
        /**
         * 記事が見つからなかった場合のメッセージを画面に表示する。
         * @memberof OpeNewsView#
         */
        showFeetNotFoundMessage : function() {
            this.notFoundMessage = $('<div data-alert class="alert-box info radius">指定された日付には記事がありません。</div>').insertBefore(
                    $(this.el).find("#feedList").parent());
        },
        /**
         *  新規記事投稿ボタン押下時に呼び出されるコールバック関数
         *  @memberof OpeNewsView#
         */
        onClickArticleRegisterButton: function () {
            app.router.opeArticleRegist({targetDate : this.targetDate});
        },
        /**
         *  
         *  @memberof OpeNewsView#
         */
        onClickArticlePreviewButton: function () {
            this.$el.append("<div id='ope_news_preview_hidden_area' style='display: block'></div>");
            this.setView("#ope_news_preview_hidden_area", new OpeNewsPreviewView({targetDate: this.targetDate})).render();
            this.$el.append("<a id='ope_news_preview_ank' href='#ope_news_preview_hidden_area'></a>");
            $("#ope_news_preview_ank").colorbox({inline: true, scrolling: true, width: "80%", height : "80%"});
            $("#ope_news_preview_ank").trigger("click");
            var onClose = function(){
            // 後始末
               $("#ope_news_preview_hidden_area").remove();
               $("#ope_news_preview_ank").remove();
               $(document).off("cbox_closed", onClose);
            };
            $(document).on("cbox_closed", $.proxy(onClose , this));
        }
    });

    module.exports = OpeNewsView;
});
