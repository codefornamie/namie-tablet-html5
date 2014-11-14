define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var FeedListView = require("modules/view/news/FeedListView");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var AbstractView = require("modules/view/AbstractView");
    var FavoriteArticleListItemView = require("modules/view/news/FavoriteArticleListItemView");
    var FavoriteYouTubeListItemView = require("modules/view/news/FavoriteYouTubeListItemView");

    /**
     * 切り抜き記事一覧(メニュー用)のViewクラス
     * 
     * @class 切り抜き記事一覧のViewクラス
     * @exports FavoriteFeedListView
     * @constructor
     */
    var FavoriteFeedListView = FeedListView.extend({
        template : require("ldsh!templates/{mode}/news/feedList"),
        articleModel : new ArticleModel(),
        /**
         * 切り抜き記事リストアイテムをクリックされたときのコールバック関数
         *  
         *  @param {Event} ev クリックイベント
         */
        onClickFeedListItem : function(ev) {
            this.showLoading();
            // クリックされたフィードに対応するarticle情報取得
            var targetView = _.find(this.views["#feedList"],function(view) {
                return view.model.id === $(ev.currentTarget).attr("data-article-id");
            });
            if (targetView && targetView.model) {
                this.articleModel.set("__id",targetView.model.get("source"));
                this.articleModel.favorite = targetView.model;
                this.articleModel.fetch({
                    success : $.proxy(this.onFetch, this),
                    error : $.proxy(this.onFailure,this)
                });
            }
            
        },
        /**
         *  article情報検索成功後のコールバック関数
         *  
         *  @param {ArticleModel} model 記事情報モデル
         *  @param {Event} event Odata取得イベント
         */
        onFetch: function (model, event) {
            var template = require("ldsh!templates/{mode}/news/articleListItem");
            // 記事一覧に追加するViewクラス
            // 以下の分岐処理で、対象のデータを表示するViewのクラスが設定される。
            var ListItemView;
            this.articleModel.set("isFavorite",true);
            
            switch (this.articleModel.get("type")) {
            case "2":
                // youtubeの場合
                template = require("ldsh!templates/{mode}/news/youTubeListItem");
                ListItemView = new FavoriteYouTubeListItemView({
                    model : this.articleModel,
                    template: template
                });
                break;
            case "1":
                // RSS記事情報の場合
                template = require("ldsh!templates/{mode}/news/articleListItem");
                if (this.articleModel.get("rawHTML")) {
                    template = require("ldsh!templates/{mode}/news/articleListItemForHtml");
                }
                ListItemView = new FavoriteArticleListItemView({
                    model : this.articleModel,
                    template: template
                });
                break;
            default:
                template = require("ldsh!templates/{mode}/news/eventsListItem");
                ListItemView = new FavoriteArticleListItemView({
                    model : this.articleModel,
                    template: template
                });
                break;
            }
            // 記事情報が物理削除または論理削除されている場合
            if (event.code === "PR404-OD-0002" || this.articleModel.get("deletedAt")) {
                template = require("ldsh!templates/{mode}/news/notFoundArticleListItem");
                ListItemView = new FavoriteArticleListItemView({
                    model : this.articleModel,
                    template: template
                });
            }

            this.parent.setView("#article-favorite-list", ListItemView);
            ListItemView.render();
            $("#contents__primary_favorite").scrollTop(0);
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
