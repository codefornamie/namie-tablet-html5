define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var ArticleListItemView = require("modules/view/news/ArticleListItemView");
    var EventListItemView = require("modules/view/news/EventListItemView");
    var YouTubeListItemView = require("modules/view/news/YouTubeListItemView");

    /**
     * 記事一覧のViewクラス
     */
    var ArticleListView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/news/articleList"),

        /**
         * 表示中の記事のID
         */
        _currentArticleId: null,

        beforeRendered : function() {
            this.setArticleList();
        },

        afterRendered : function() {
        },

        /**
         * 初期化処理
         */
        initialize : function() {
            // 表示する記事ページのインデックス
            app.set('currentPage', 0);
            this.listenTo(app, 'change:currentPage', this.onChangeCurrentPage);

            // イベントを登録
            $(document).on('scrollToArticle.articleList', this.scrollToArticle.bind(this));
            $(document).on('willChangeFontSize.articleList', this.willChangeFontSize.bind(this));
            $(document).on('didChangeFontSize.articleList', this.didChangeFontSize.bind(this));
        },

        /**
         *  viewがremoveされる時に呼ばれる
         */
        cleanup: function () {
            $(document).off('scrollToArticle.articleList');
            $(document).off('willChangeFontSize.articleList');
            $(document).off('didChangeFontSize.articleList');
        },

        /**
         * 指定されたarticleIdの記事までスクロール
         *
         * @param {jQuery.Event} ev
         * @param {Object} param
         */
        scrollToArticle: function (ev, param) {
            var articleId = param.articleId;
            var immediate = !!param.immediate;
            var heightHeader = $('.header').height() || 0;
            var heightGlobalNav = $('.global-nav').height() || 0;
            var heightBacknumberNav = $('.backnumber-nav').height() || 0;
            var heightMargin = 10;
            var position = $("#" + articleId).offset().top - heightHeader - heightGlobalNav - heightBacknumberNav - heightMargin;

            // 現在の記事詳細のスクロール位置と相対位置を加算した箇所までスクロールする
            $(".contents__primary").animate({
                scrollTop : position + $(".contents__primary").scrollTop()
            }, {
                queue : false,
                duration: (immediate) ? 0 : 400
            });
        },

        /**
         * 取得した動画一覧を描画する
         */
        setArticleList : function() {
            var currentPage = app.get('currentPage');
            var model = this.collection.at(currentPage);

            this.collection.each(function (model) {
                var template = require("ldsh!templates/{mode}/news/articleListItem");
                // 記事一覧に追加するViewクラス。
                // 以下の分岐処理で、対象のデータを表示するViewのクラスが設定される。
                var ListItemView;

                switch (model.get("type")) {
                case "2":
                    template = require("ldsh!templates/{mode}/news/youTubeListItem");
                    ListItemView = YouTubeListItemView;
                    break;
                case "3":
                    template = require("ldsh!templates/{mode}/news/eventsDetail");
                    ListItemView = EventListItemView;
                    break;
                case "4":
                    template = require("ldsh!templates/{mode}/news/eventsDetail");
                    ListItemView = EventListItemView;
                    break;
                default:
                    template = require("ldsh!templates/{mode}/news/articleListItem");
                    ListItemView = ArticleListItemView;
                    if (model.get("rawHTML")) {
                        template = require("ldsh!templates/{mode}/news/articleListItemForHtml");
                    } else if (model.get("modelType") === "youtube") {
                        // TODO articleにtypeが全て登録されたら
                        template = require("ldsh!templates/{mode}/news/youTubeListItem");
                        ListItemView = YouTubeListItemView;
                    }
                    break;
                }

                this.insertView("#articleList", new ListItemView({
                    model : model,
                    template: template
                }));
            }.bind(this));
        },

        /**
         * 指定したページに移動する
         * @param {Number} page
         */
        goToPage: function (page) {
            // 範囲外ならば移動しない
            if (page < 0) return;
            if (this.collection.length <= page) return;

            // 範囲内ならば表示しているページを更新する
            app.set('currentPage', page);
        },

        /**
         * 前のページに移動する
         */
        goToPreviousPage: function () {
            var currentPage = app.get('currentPage');
            this.goToPage(currentPage - 1);
        },

        /**
         * 次のページに移動する
         */
        goToNextPage: function () {
            var currentPage = app.get('currentPage');
            this.goToPage(currentPage + 1);
        },

        /**
         * currentPageが更新されたら呼ばれる
         */
        onChangeCurrentPage: function () {
            this.render();
        },

        /**
         * 文字サイズを変更する直前に呼ばれる
         *
         * @param {jQuery.Event} ev
         * @param {Object} param
         */
        willChangeFontSize: function (ev, param) {
            var $currentPost = $('.post').filter(function () {
                return 0 <= $(this).position().top + $(this).height();
            }).first();

            this._currentArticleId = $currentPost.attr('id');
        },

        /**
         * 文字サイズを変更した直後に呼ばれる
         *
         * @param {jQuery.Event} ev
         * @param {Object} param
         */
        didChangeFontSize: function () {
            $(document).trigger('scrollToArticle', {
                articleId: this._currentArticleId,
                immediate: true
            });
        },
    });

    module.exports = ArticleListView;
});
