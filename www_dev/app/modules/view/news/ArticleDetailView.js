define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var FavoriteModel = require("modules/model/article/FavoriteModel");
    var CommonUtil = require("modules/util/CommonUtil");
    
    var ArticleDetailView = AbstractView.extend({
        template : require("ldsh!/app/templates/news/articleDetail"),
        serialize : function() {
            return {
                model : this.model
            };
        },
        beforeRendered : function() {

        },

        afterRendered : function() {
            // 既にお気に入り登録されている記事のお気に入りボタンを非表示にする
            if (this.model.get("isFavorite")) {
                $("#favoriteRegistButton").hide();
            }
            if (this.model.get("imageUrl")) {
                $("#articleDetailImage").attr("src",this.model.get("imageUrl"));
            } else {
                $("#articleDetailImageArea").hide();
            }
            // 縦書き表示処理
            $(".nehandiv").nehan({
                usePager:false, // if false, pager disabled(append mode)
            direction:"vert", // or "vert"
            hori:"lr-tb",
            vert:"tb-rl", // or "tb-lr"
            fontSize:16,
            rowCount:1, // 1 or 2 available
            colCount:1, // 1 or 2 available
            spacingSize:16,
//            pagerElements:["left-prev", "indicator", "right-next"]
          });
            if (this.model.get("imageUrl")) {
                $("#nehan-articleDetailImage").parent().css("width","auto");
                $("#nehan-articleDetailImage").parent().css("height","auto");
                $("#nehan-articleDetailImage").css("width","auto");
                $("#nehan-articleDetailImage").css("height","auto");
            }
            
            $(".panzoom-elements").panzoom({
                minScale: 1,
                contain: "invert"
            });
            
            // タグボタンの追加 
            // beforeRenderで実施すると要素がなくタグが挿入できなかったためここで実装
            if (this.model.get("tagsArray").length) {
                _.each(this.model.get("tagsArray"), $.proxy(function (tag) {
                    var tagLabel = CommonUtil.sanitizing(tag);
                    $("#tagButtons").append("<button type='button' class='deleteTag'>"+ tagLabel +"</button>");
                },this));
            }
        },
        /**
         * 初期化処理
         */
        initialize : function() {

        },
        events : {
            "click #favoriteRegistButton" : "onClickFavoriteRegistButton",
            "click #tagAddButton" : "onClickTagAddButton",
            "click .deleteTag" : "onClickDeleteTag"
        },
        /**
         * お気に入りボタン押下時のコールバック関数
         */
        onClickFavoriteRegistButton : function () {
            var favoriteModel = new FavoriteModel();
            var source = this.model.get("__id");
            if (this.model.get("url")) {
                source = this.model.get("url");
            }
            favoriteModel.set("source",source);
            favoriteModel.set("userId","namie");
            favoriteModel.set("contents",this.model.get("description"));
            favoriteModel.set("title",this.model.get("title"));
            favoriteModel.set("createdAt",new Date().toISOString());
            favoriteModel.save(null, {
                success : $.proxy(function () {
                    $("#favoriteRegistButton").hide();
                    this.model.set("isFavorite",true);
                },this)
            });
            
        },
        /**
         * タグ追加ボタン押下時のコールバック関数
         */
        onClickTagAddButton : function () {
            if ($("#tagInput").val()) {
                this.model.get("tagsArray").push($("#tagInput").val());
                this.model.set("tagsArray",_.uniq(this.model.get("tagsArray")));
                this.model.save(null,{success : $.proxy(this.onSave,this)});
            }
        },
        /**
         * 記事情報更新完了後のコールバック関数
         */
        onSave : function () {
            this.model.fetch({success :$.proxy(function () {
                this.render();
            },this)});
        },
        /**
         * タグボタン押下時のコールバック関数
         * @params {event} タグボタンのクリックイベント
         */
        onClickDeleteTag : function (ev) {
            var tagLabel = $(ev.currentTarget).text();
            this.model.set("tagsArray",_.without(this.model.get("tagsArray"),tagLabel));
            this.model.save(null,{success : $.proxy(this.onSave,this)});
        },
    });

    module.exports = ArticleDetailView;
});
