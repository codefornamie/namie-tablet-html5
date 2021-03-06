/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var FavoriteFeedListView = require("modules/view/news/FavoriteFeedListView");
    var FavoriteCollection = require("modules/collection/article/FavoriteCollection");
    var Equal = require("modules/util/filter/Equal");
    var And = require("modules/util/filter/And");
    var IsNull = require("modules/util/filter/IsNull");

    /**
     * 切り抜き記事一覧・詳細画面のViewクラス
     */
    var ScrapView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/scrap/scrap"),
        favoriteCollection : new FavoriteCollection(),

        beforeRendered : function() {
        },

        afterRendered : function() {
            app.ga.trackPageView("Favorite","切り抜き一覧ページ");
        },

        initialize : function() {
            this.showLoading();

            // 切り抜き情報の検索
            this.searchFavorite();
        },
        /**
         *  自身のユーザIDで切り抜き情報を検索する
         */
        searchFavorite: function () {
            var self = this;
            // 自身のユーザIDでフィルタ
            this.favoriteCollection.condition.filters = [ new And([
                    new Equal("userId", app.user.get("__id")),
                    new IsNull("deletedAt") ]) ];

            this.favoriteCollection.fetch({
                success: $.proxy(this.onFetch,this),
                error: $.proxy(this.onFailure,this)
            });
        },
        /**
         *  切り抜き情報検索完了後のコールバック関数
         */
        onFetch: function () {
            // FavoriteFeedListView初期化
            var favoriteFeedListView = new FavoriteFeedListView();

            this.favoriteCollection.models = this.favoriteCollection.sortBy(function(favorite) {
                                return favorite.get("updatedAt");
                            });
            favoriteFeedListView.collection = this.favoriteCollection;
            favoriteFeedListView.parent = this;
            this.setView("#sidebar__favorite__list", favoriteFeedListView);
            favoriteFeedListView.render();
            if (this.favoriteCollection.size() === 0) {
                $(this.el).find("#feedList").text("記事情報がありません");
            }

            // 初期表示処理
            if (favoriteFeedListView.collection.size() !== 0) {
                var firstView = favoriteFeedListView.views["#feedList"][0];
                $(firstView.el).find("li")[0].click();
            }
            this.hideLoading();
        },
        /**
         *  切り抜き情報検索失敗後のコールバック関数
         */
        onFailure: function (err) {
            app.logger.error(err);
            this.hideLoading();
        },

    });
    module.exports = ScrapView;
});
