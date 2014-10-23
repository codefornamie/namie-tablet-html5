define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var ArticleListItemView = require("modules/view/news/ArticleListItemView");

    /**
     * 記事一覧のViewクラス
     */
    var ArticleListView = AbstractView.extend({
        template : require("ldsh!/app/templates/news/articleList"),

        beforeRendered : function() {
            this.setArticleList();
        },

        afterRendered : function() {

        },
        /**
         * 初期化処理
         */
        initialize : function() {

        },
        /**
         * 取得した動画一覧を描画する
         */
        setArticleList : function() {
            var self = this;
            this.collection.each($.proxy(function(model) {
                var itemView = new ArticleListItemView();
                this.insertView("#articleList", new ArticleListItemView({
                    model : model,
                }));
            }, this));

        }
    });

    module.exports = ArticleListView;
});
