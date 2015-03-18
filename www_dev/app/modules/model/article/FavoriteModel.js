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
    var ArticleModel = require("modules/model/article/ArticleModel");
    var CommonUtil = require("modules/util/CommonUtil");

    /**
     * お気に入り情報のモデルクラスを作成する。
     * 
     * @class お気に入り情報のモデルクラス
     * @exports FavoriteModel
     * @constructor
     */
    var FavoriteModel = ArticleModel.extend({
        entity : "favorite",
        /**
         * 取得したOData情報のparse処理を行う。
         * @param {Object} response レスポンス情報
         * @param {Object} options オプション情報
         * @return {Object} パース後の情報
         * @memberOf FavoriteModel#
         */
        parseOData : function(response, options) {
            response.dispSite = CommonUtil.sanitizing(response.site);
            response.dispTitle = CommonUtil.sanitizing(response.title);
            return response;
        },
        /**
         * モデル固有の永続化データを生成する。
         * @param {Object} saveData 永続化データ
         * @memberOf FavoriteModel#
         */
        makeSaveData : function(saveData) {
            saveData.source = this.get("source");
            saveData.userId = this.get("userId");
            var contents = this.get("contents");
            if (contents && contents.length > 100) {
                contents = contents.substr(0,100);
            }
            saveData.contents = contents;
            saveData.title = this.get("title");
            saveData.type = this.get("type");
            saveData.site = this.get("site");
            saveData.imageUrl = this.get("imageUrl");
            saveData.publishedAt = this.get("publishedAt");
            saveData.createdAt = this.get("createdAt");
        }

    });

    module.exports = FavoriteModel;
});
