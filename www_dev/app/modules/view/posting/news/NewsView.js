define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleListView = require("modules/view/posting/news/ArticleListView");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var Equal = require("modules/util/filter/Equal");
    var And = require("modules/util/filter/And");

    /**
     * 記事一覧・詳細のメインとなる画面のViewクラス
     * 
     * @class 記事一覧・詳細のメインとなる画面のViewクラス
     * @exports NewsView
     * @constructor
     */
    var NewsView = AbstractView.extend({

        template : require("ldsh!templates/{mode}/news/news"),
        articleCollection : new ArticleCollection(),

        beforeRendered : function() {
        },

        afterRendered : function() {
        },

        initialize : function() {
            this.showLoading();
            this.loadArticle();
        },
        /**
         *  articleを読み込む
         */
        loadArticle: function () {
            this.articleCollection.condition.filters = [
                new And([
                        new Equal("type", "3"), new Equal("createUserId", app.user.get("__id"))
                ])
            ];

            this.articleCollection.fetch({
                success: $.proxy(function () {
                    this.onFetch();
                },this),
                
                error: $.proxy(function () {
                    alert("記事一覧の取得に失敗しました");
                    this.hideLoading();
                },this)
            });
        },
        
        /**
         *  全ての情報検索完了後のコールバック関数
         */
        onFetch: function () {

            // ArticleListView初期化
            var articleListView = new ArticleListView();
            articleListView.collection = this.articleCollection;
            this.setView("#article-list", articleListView);
            articleListView.render();
            if (this.articleCollection.size() === 0) {
                $(this.el).find("#article-list").text("記事情報がありません");
            }

            this.hideLoading();
        },

    });

    module.exports = NewsView;
});
