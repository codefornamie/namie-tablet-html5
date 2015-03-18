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
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var FavoriteModel = require("modules/model/article/FavoriteModel");

    /**
     * お気に入り情報のコレクションクラス
     * @class お気に入り情報のコレクションクラス
     * @exports FavoriteCollection
     * @constructor
     */
    var FavoriteCollection = AbstractODataCollection.extend({
        model : FavoriteModel,
        entity : "favorite",
        /**
         * 初期化処理
         * @memberOf FavoriteCollection#
         */
        initialize : function() {
            this.condition = {
                top : 1000
            };
        },
    });

    module.exports = FavoriteCollection;
});
