define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var ArticleListItemView = require("modules/view/news/ArticleListItemView");
    var colorbox = require("colorbox");

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
         * @memberof FavoriteArticleListItemView#
         */
        onFavoriteDelete : function() {
            app.router.scrap();
        },
        /**
         * このViewが表示している記事に関連する画像データの取得と表示を行う。
         * @memberof FavoriteArticleListItemView#
         */
        showImage : function() {
            var self = this;
            var articleImageElement = this.$el.find(".articleDetailImage");
            if (this.model.isPIOImage()) {
                this.showPIOImages(".articleDetailImage", [
                    {
                        imageUrl : this.model.get("imageUrl"),
                        imageIndex : 1
                    }

                ],true);
            } else if (!_.isEmpty(this.model.get("imageUrl"))) {
                articleImageElement.attr("src", this.model.get("imageUrl"));
                var imageElems = $(this.el).find("img");
                imageElems.each(function() {
                    if ($(this).attr("src")) {
                        $(this).wrap("<a class='expansionPicture' href='" + $(this).attr("src") + "'></a>");
                    }
                });
                $(this.el).find(".expansionPicture").colorbox({
                    rel:"expansionPicture",
                    photo: true,
                    maxWidth: "100%",
                    maxHeight: "100%"
                });

            }
        },


    });
    module.exports = FavoriteArticleListItemView;
});
