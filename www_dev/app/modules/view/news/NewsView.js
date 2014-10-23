define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleListView = require("modules/view/news/ArticleListView");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");

    /**
     * 記事一覧・詳細のメインとなる画面のViewクラス
     */
    var NewsView = AbstractView.extend({
        template : require("ldsh!/app/templates/news/news"),
        model : new ArticleModel(),
        collection : new ArticleCollection(),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {
            this.collection = new ArticleCollection();

            var articleListView = new ArticleListView();
            articleListView.collection = this.collection;
            this.setView(".article-list", articleListView);

            articleListView.listenTo(this.collection, "reset sync request", articleListView.render);
            
            this.collection.fetch();

        },

        events : {
//            "click #newsRegist" : "onClickNewsRegistButton"
        },
        onClickNewsRegistButton : function () {
            //テストデータ登録用
//            this.model.set("site","xxxx民報");
//            this.model.set("url","http://xxx/xxx.rss");
//            this.model.set("link","http://xxx/xxx.html");
//            this.model.set("createdAt","2014-10-24T11:23:22");
//            this.model.set("updatedAt","2014-09-24T11:23:22");
//            this.model.set("deletedAt",null);
//            this.model.set("title","xxxxxxx　東京で叙勲祝賀会");
//            this.model.set("description","xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
//            this.model.set("auther","xxxxxxx");
//            this.model.set("scraping",0);
//            this.model.save();
        },

    });

    module.exports = NewsView;
});
