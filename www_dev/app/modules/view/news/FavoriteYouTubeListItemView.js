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
