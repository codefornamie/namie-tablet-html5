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
        
        /**
         * 現在のページ番号
         */
        currentPage: 0,

        beforeRendered : function() {
            this.destroyIScroll();
            this.setArticleList();
        },

        afterRendered : function() {
            this.initIScroll();
            
            // 読み込み後のフェードインのため
            $('.article-list').addClass('is-ready');
        },
        /**
         * 初期化処理
         */
        initialize : function() {
        },
        
        /**
         * iScrollを初期化する
         */
        initIScroll: function () {
            var self = this;
            
            // iscrollインスタンスを生成する
            this.iscroll = new IScroll('#contents__primary', {
                momentum: false,
                scrollbars: true,
                probeType: 1
            });
            
            // scroll量に従ってページ切り替えを行う
            this.iscroll.on('scroll', function () {
                var y = self.iscroll.y;

                // 上
                if (80 < y) {
                    self.goToPreviousPage();

                // 下
                } else if (y < -80) {
                    self.goToNextPage();
                }
            });
        },
        
        /**
         * 生成済みのiscrollインスタンスを破棄する
         */
        destroyIScroll: function () {
            if (this.iscroll) {
                this.iscroll.destroy();
                this.iscroll = null;
            }
        },

        /**
         * 取得した動画一覧を描画する
         */
        setArticleList : function() {
            var model = this.collection.at(this.currentPage);
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

            this.setView("#articleList", new ArticleListItemView({
                model : model,
                template: template
            }));
        },
        
        /**
         * 指定したページに移動する
         * @param {Number} page
         */
        goToPage: function (page) {
            // 範囲外ならば移動しない
            if (page < 0) return;
            if (this.collection.models.length <= page) return;
            
            this.currentPage = page;
            this.render();
        },
        
        /**
         * 前のページに移動する
         */
        goToPreviousPage: function () {
            this.goToPage(this.currentPage - 1);
        },
        
        /**
         * 次のページに移動する
         */
        goToNextPage: function () {
            this.goToPage(this.currentPage + 1);
        }
    });

    module.exports = ArticleListView;
});
