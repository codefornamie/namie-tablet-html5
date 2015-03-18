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
    var AbstractCollection = require("modules/collection/AbstractCollection");
    var YouTubeModel = require("modules/model/dojo/YouTubeModel");

    /**
     * YouTubeのコレクションクラス
     * 
     * @class YouTubeのコレクションクラス
     * @exports YouTubeCollection
     * @constructor
     */
    var YouTubeCollection = AbstractCollection.extend({
        model : YouTubeModel,
        /**
         * 操作対象のチャンネルID
         * @memberOf YouTubeCollection#
         */
        channelId : null,
        sync : function(method, model, options) {
            if (!options) {
                options = {};
            }
            var def = $.Deferred();

            gapi.client.request({
                path : "/youtube/v3/search",
                mine : false,
                params : {
                    channelId : this.channelId,
                    type : "video",
                    part : "id,snippet",
                    maxResults : 50,
                    order : "date",
                },
                callback : $.proxy(function(res) {

                    if (res.error) {
                        def.reject(res);
                        if (options.error) {
                            options.error(res);
                        }
                    } else if (options.success) {
                        options.success(res);
                    }

                    if (options.complete) {
                        options.complete(res.error, model, res);
                    }
                    if (def.state() === "pending") {
                        def.resolve(res);
                    }
                }, this)
            });
            return def.promise();
        },
        /**
         * レスポンスのパース処理を行う
         * @param {Object} レスポンス情報
         * @param {Object} オプション
         * @return {Object} レスポンス情報のitemオブジェクト
         * @memberOf YouTubeCollection#
         */
        parse : function(response, options) {
            return response.items;
        }
    });

    module.exports = YouTubeCollection;
});