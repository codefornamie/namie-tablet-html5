/* global IScroll:true */

define(function(require, exports, module) {
    "use strict";
    var app = require("app");
    var TabletArticleListView = require("modules/view/news/ArticleListView");
    var ArticleListItemView = require("modules/view/posting/news/ArticleListItemView");

    /**
     * 記事一覧のViewクラス
     */
    var ArticleListView = TabletArticleListView.extend({
        template : require("ldsh!templates/{mode}/news/articleList"),
        
        /**
         * 取得した記事一覧を描画する
         */
        setArticleList : function() {
            var currentPage = app.get('currentPage');
            var model = this.collection.at(currentPage);
            
            this.collection.each(function (model) {
                this.insertView("#articleList", new ArticleListItemView({
                    model : model,
                    template: require("ldsh!templates/{mode}/news/articleListItem")
                }));
            }.bind(this));

        },
    });

    module.exports = ArticleListView;
});
