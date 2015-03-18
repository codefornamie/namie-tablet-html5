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
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var Code = require("modules/util/Code");

    /**
     * 記事一覧アイテム(メニュー用)のViewを作成する。
     * 
     * @class 記事一覧アイテム(メニュー用)のView
     * @exports FeedListItemView
     * @constructor
     */
    var FeedListItemView = AbstractView.extend({
        /**
         * このViewのテンプレートファイパス
         * @memberOf EventListItemView#
         */
        template : require("ldsh!templates/{mode}/news/feedListItem"),

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         * @memberOf EventListItemView#
         */
        afterRendered : function() {
            var self = this;
            var articleImageElement = this.$el.find(".articleImage");
            var imageType = this.model.getThumbImageType();

            var imageUrl = this.model.get("imageThumbUrl");
            switch (imageType) {
            case Code.IMAGE_TYPE_PIO:
                this.showPIOImages(".articleImage", [
                    {
                        imageUrl : imageUrl,
                        imageIndex : 1
                    }
                ]);

                break;

            case Code.IMAGE_TYPE_URL:
                articleImageElement.attr("src", imageUrl);
                break;

            case Code.IMAGE_TYPE_NONE:
                break;

            default:
                break;
            }
        }
    });

    module.exports = FeedListItemView;
});
