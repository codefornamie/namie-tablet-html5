define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
//    var AtricleModel = require("modules/model/atricle/AtricleModel");

    var NewsView = AbstractView.extend({
        template : require("ldsh!/app/templates/news/news"),
//        model : new AtricleModel(),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {

        },

        events : {
            "click #newsRegist" : "onClickNewsRegistButton"
        },
        onClickNewsRegistButton : function () {
//            this.model.set("site","福島民報");
//            this.model.set("url","http://xxx/xxx.rss");
//            this.model.set("link","http://xxx/xxx.html");
//            this.model.set("createdAt","2014-10-22T11:22:22");
//            this.model.set("updatedAt","2014-10-22T11:22:22");
//            this.model.set("deletedAt","2014-10-22T11:22:22");
//            this.model.set("title","記事タイトル");
//            this.model.set("summary","記事サマリー");
//            this.model.set("description","記事詳細");
//            this.model.set("auther","Masuda");
//            this.model.set("scraping",0);
//            this.model.save();
        },

    });

    module.exports = NewsView;
});
