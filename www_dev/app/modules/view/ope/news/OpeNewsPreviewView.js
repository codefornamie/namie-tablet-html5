define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    // view
    var AbstractView = require("modules/view/AbstractView");
    var ArticleListView = require("modules/view/news/ArticleListView");
    var GridListView = require("modules/view/news/GridListView");
    var RecommendArticleView = require("modules/view/news/RecommendArticleView");
    var ArticleListItemView = require("modules/view/news/ArticleListItemView");
    var EventListItemView = require("modules/view/news/EventListItemView");
    var YouTubeListItemView = require("modules/view/news/YouTubeListItemView");
    var NewsView = require("modules/view/news/NewsView");

    /**
     * 運用管理アプリの記事一覧画面を表示するためのViewクラスを作成する。
     * 
     * @class 運用管理アプリの記事一覧画面を表示するためのView
     * @exports OpeNewsPreviewView
     * @constructor
     */
    var OpeNewsPreviewView = NewsView.extend({
        template : require("ldsh!templates/news/news/news"),

        /**
         * News一覧の各Gridがクリックされたときの動作
         * 
         * @param {jQuery.Event} ev
         * @param {Object} param
         * @memberOf NewsView#
         */
        onClickGridItem : function(ev, param) {
            // プレビューのためクリックを無視するため何もしない
        },

    });

    module.exports = OpeNewsPreviewView;
});
