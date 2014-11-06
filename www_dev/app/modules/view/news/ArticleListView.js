/* global IScroll:true */

define(function(require, exports, module) {
    "use strict";
    
    require('iscroll');

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
            var iscroll = new IScroll('#contents__primary', {
                momentum: false,
                scrollbars: true
            });
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
            var model = this.collection.at(0);
            var template = require("ldsh!/app/templates/news/articleListItem");

            switch (model.get("modelType")) {
                case "youtube":
                    template = require("ldsh!/app/templates/news/articleListItem");
                    break;
                case "event":
                    template = require("ldsh!/app/templates/news/eventsListItem");
                    break;
                default:
                    template = require("ldsh!/app/templates/news/articleListItem");
                    break;
            }

            this.insertView("#articleList", new ArticleListItemView({
                model : model,
                template: template
            }));
        }
    });

    module.exports = ArticleListView;
});
