define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var YouTubeListItemView = require("modules/view/news/YouTubeListItemView");

    /**
     * 切り抜きYouTube記事一覧アイテムのViewを作成する。
     * 
     * @class 切り抜きYouTube記事一覧アイテムのView
     * @exports FavoriteYouTubeListItemView
     * @constructor
     */
    var FavoriteYouTubeListItemView = YouTubeListItemView.extend({
        /**
         * 切り抜き情報削除後に呼び出されるコールバック関数。
         */
        onFavoriteDelete : function() {
            app.router.scrap();
        },

    });
    module.exports = FavoriteYouTubeListItemView;
});
