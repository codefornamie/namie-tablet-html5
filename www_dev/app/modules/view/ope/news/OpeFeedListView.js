define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var FeedListView = require("modules/view/news/FeedListView");
    var jquerySortable = require("jquery-sortable");

    /**
     * 運用管理ツールの記事一覧テーブルのViewクラスを作成する。
     * @class 運用管理ツールの記事一覧テーブルのView
     * @exports OpeFeedListView
     * @constructor
     */
    var OpeFeedListView = FeedListView.extend({
        events: {
            "click .feedListItem" : "onClickFeedListItem",
            "onRecommendFetch .today-recommend-radio" : "onRecommendFetch"
        },
        afterRendered : function() {
            // ドラッグアンドドロップによるテーブルの並び替えを行うための設定
            this.$('.sortable').sortable({
                items : 'tr',
                forcePlaceholderSize : true,
                handle : '.handle'
            });
            this.recommendArticle = this.collection.find($.proxy(function(model) {
                return model.get("isRecommend");
            },this));
        },
        /**
         * おすすめ記事登録処理後のコールバック関数処理
         * 
         * @param {event} フェッチ後イベント
         * @param {ArticleModel} おすすめ情報を保存した記事情報
         */
        onRecommendFetch: function(event, recommendedModel) {
            if (this.recommendArticle) {
                this.recommendArticle.set("isRecommend",null);
                this.recommendArticle.save(null,{
                    success:$.proxy(function(){
                        this.onUnRecommendSave(recommendedModel);
                    },this),
                    error:$.proxy(function () {
                        alert("おすすめ記事情報の保存に失敗しました");
                        this.hideLoading();
                    },this)
                });
            } else {
                this.hideLoading();
                this.recommendArticle = recommendedModel;
            }
        },
        /**
         * おすすめ記事削除処理後のコールバック関数処理
         * 
         * @param {ArticleModel} おすすめ情報を保存した記事情報
         */
        onUnRecommendSave: function(recommendedModel) {
            this.recommendArticle.fetch({
                success:$.proxy(function() {
                    this.hideLoading();
                    this.recommendArticle = recommendedModel;
                },this)
            });
        },
    });

    module.exports = OpeFeedListView;
});
