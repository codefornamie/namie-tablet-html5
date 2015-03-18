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
         * @memberOf FavoriteArticleListItemView#
         */
        onFavoriteDelete : function() {
            app.router.scrap();
        },
        /**
         * このViewが表示している記事に関連する画像データの取得と表示を行う。
         * @memberOf FavoriteArticleListItemView#
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

                ], true, $.proxy(this.onClickImage, this));
            } else if (!_.isEmpty(this.model.get("imageUrl"))) {
                articleImageElement.attr("src", this.model.get("imageUrl"));
                var imageElems = $(this.el).find("img");
                imageElems.each(function() {
                    if ($(this).attr("src")) {
                        $(this).wrap("<a class='expansionPicture' href='" + $(this).attr("src") + "'></a>");
                    }
                });
                $(this.el).find(".expansionPicture").colorbox({
                    closeButton : false,
                    current : "",
                    photo : true,
                    maxWidth : "83%",
                    maxHeight : "100%",
                    onComplete : $.proxy(function() {
                        $("#cboxOverlay").append("<button id='cboxCloseButton' class='small button'>閉じる</button>");
                        $("#cboxOverlay").append("<button id='cboxSaveButton' class='small button'>画像を保存</button>");
                        $("#cboxCloseButton").click(function() {
                            $.colorbox.close();
                        });
                        $("#cboxSaveButton").click($.proxy(this.onClickImage, this));
                    },this),
                    onClosed : function() {
                        $("#cboxSaveButton").remove();
                        $("#cboxCloseButton").remove();
                    }
                });

            }
        },

    });
    module.exports = FavoriteArticleListItemView;
});
