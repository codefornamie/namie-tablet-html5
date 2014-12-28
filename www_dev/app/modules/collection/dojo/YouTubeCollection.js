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
                    maxResults : 40,
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