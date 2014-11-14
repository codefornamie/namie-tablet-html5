define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var ArticleListItemView = require("modules/view/news/ArticleListItemView");

    /**
     * 切り抜き記事一覧アイテムのViewを作成する。
     * 
     * @class 切り抜き記事一覧アイテムのView
     * @exports FavoriteArticleListItemView
     * @constructor
     */
    var FavoriteArticleListItemView = ArticleListItemView.extend({
        /**
         * 切り抜き情報削除後に呼び出されるコールバック関数。
         */
        onFavoriteDelete : function() {
            app.router.scrap();
        },

    });
    module.exports = FavoriteArticleListItemView;
});
