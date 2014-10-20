define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var YouTubeModel = require("modules/model/youtube/YouTubeModel");

    var YouTubeCollection = Backbone.Collection.extend({
        model : YouTubeModel,
        channelId : null,
        sync : function(method, model, options) {
            if (!options) {
                options = {};
            }

            gapi.client.request({
                path : "/youtube/v3/search",
                mine : false,
                params : {
                    channelId : this.channelId,
                    type : "video",
                    part : "id,snippet",
                    maxResults : 5,
                    order : "date",
                },
                callback : $.proxy(function(res) {

                    if (res.error) {
                        if (options.error) {
                            options.error(res);
                        }
                    } else if (options.success) {
                        options.success(res);
                    }

                    if (options.complete) {
                        options.complete(res.error, model, res);
                    }
                }, this)
            });
        },
        parse : function parse(response, options) {
            return response.items;
        }
    });

    module.exports = YouTubeCollection;
});
