define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var TabletArticleListItemView = require("modules/view/news/ArticleListItemView");

    /**
     * 記事一覧アイテムのViewを作成する。
     * 
     * @class 記事一覧アイテムのView
     * @exports ArticleListItemView
     * @constructor
     */
    var ArticleListItemView = TabletArticleListItemView.extend({
        template : require("ldsh!templates/{mode}/news/articleListItem"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
//            this.showImage();
            if(this.model.get("parent")){
                this.$el.find("#articleEditButton").text("レポート詳細");
                this.$el.find("#articleReportButton").hide();
            }
        },

        /**
         * このViewのイベントを定義する。
         */
        events : {
            "click a" : "onClickAnchorTag",
            "click #articleEditButton" : "onClickArticleEditButton",
            "click #articleReportButton" : "onClickArticleReportButton"
        },
        
        /**
         * イベント詳細ボタンを押下された際のハンドラ
         */
        onClickArticleEditButton : function(e){
            app.router.articleRegist({model:this.model});
        },
        /**
         * レポートを書くボタンを押下された際のハンドラ
         */
        onClickArticleReportButton : function(e){
            app.router.articleRegist({parentModel: this.model, articleCategory: "4"});
        }
    });
    module.exports = ArticleListItemView;
});
