define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var FeedListView = require("modules/view/news/FeedListView");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var ArticleListItemView = require("modules/view/news/ArticleListItemView");
    var YouTubeListItemView = require("modules/view/news/YouTubeListItemView");

    /**
     * 切り抜き記事一覧(メニュー用)のViewクラス
     */
    var FavoriteFeedListView = FeedListView.extend({
        template : require("ldsh!templates/{mode}/news/feedList"),
        articleModel : new ArticleModel(),
        /**
         * 切り抜き記事リストアイテムをクリックされたときのコールバック関数
         *  
         *  @param {Event} ev
         */
        onClickFeedListItem : function(ev) {
            this.showLoading();
            // クリックされたフィードに対応するarticle情報取得
            var targetView = _.find(this.views["#feedList"],function(view) {
                return view.model.id === $(ev.currentTarget).attr("data-article-id");
            });
            if (targetView && targetView.model) {
                this.articleModel.set("__id",targetView.model.get("source"));
                this.articleModel.fetch({
                    success : $.proxy(this.onFetch, this),
                    error : $.proxy(this.onFailure,this)
                });
            }
            
        },
        /**
         *  article情報検索失敗後のコールバック関数
         */
        onFetch: function () {
            var template = require("ldsh!templates/{mode}/news/articleListItem");
            // 記事一覧に追加するViewクラス。
            // 以下の分岐処理で、対象のデータを表示するViewのクラスが設定される。
            var ListItemView;
            
            switch (this.articleModel.get("type")) {
            case "2":
                template = require("ldsh!templates/{mode}/news/youTubeListItem");
                ListItemView = new YouTubeListItemView({
                    model : this.articleModel,
                    template: template
                });
                break;
            default:
                template = require("ldsh!templates/{mode}/news/articleListItem");
                if (this.articleModel.get("modelType") === "event") {
                    template = require("ldsh!templates/{mode}/news/eventsListItem");
                }
                if (this.articleModel.get("rawHTML")) {
                    template = require("ldsh!templates/{mode}/news/articleListItemForHtml");
                }
                ListItemView = new ArticleListItemView({
                    model : this.articleModel,
                    template: template
                });
                break;
            }

            this.parent.setView("#article-favorite-list", ListItemView);
            ListItemView.render();
            this.hideLoading();

        },
        /**
         *  article情報検索失敗後のコールバック関数
         */
        onFailure: function (err) {
            console.log(err);
            this.hideLoading();
        },

    });

    module.exports = FavoriteFeedListView;
});
