define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var FavoriteFeedListView = require("modules/view/news/FavoriteFeedListView");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var FavoriteCollection = require("modules/collection/article/FavoriteCollection");
    var Equal = require("modules/util/filter/Equal");
    var Or = require("modules/util/filter/Or");

    var ScrapView = AbstractView.extend({
        template : require("ldsh!/app/templates/scrap/scrap"),
        articleCollection : new ArticleCollection(),
        favoriteCollection : new FavoriteCollection(),

        beforeRendered : function() {
        },

        afterRendered : function() {
        },

        initialize : function() {
            this.showLoading();

            // 切り抜き情報の検索
            this.searchFavorite();
        },
        /**
         *  自身のユーザIDで切り抜き情報を検索する
         *  @param {Function} callback
         */
        searchFavorite: function () {
            var self = this;
            // 自身のユーザIDでフィルタ
            this.favoriteCollection.condition.filters = [new Equal("userId", app.user.id)];
            
            this.favoriteCollection.fetch({
                success: $.proxy(this.onFetch,this),
                error: $.proxy(this.onFailure,this)
            });
        },
        /**
         *  切り抜き情報検索完了後のコールバック関数
         *  @param {Error|Undefined} err
         */
        onFetch: function () {

            // FeedListView初期化
            var favoriteFeedListView = new FavoriteFeedListView();
            favoriteFeedListView.collection = this.favoriteCollection;
            favoriteFeedListView.parent = this;
            this.setView("#sidebar__favorite__list", favoriteFeedListView);
            favoriteFeedListView.render();
            
            // 初期表示処理
            var firstView = favoriteFeedListView.views["#feedList"][0];
            $(firstView.el).find("li")[0].click();
            this.hideLoading();
        },
        /**
         *  切り抜き情報検索失敗後のコールバック関数
         */
        onFailure: function (err) {
            console.log(err);
            this.hideLoading();
        },

    });
    module.exports = ScrapView;
});
