define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractModel = require("modules/model/AbstractModel");
    /**
     * YouTubeのモデルクラスを作成する。
     * 
     * @class YouTubeのモデルクラス
     * @exports YouTubeModel
     * @constructor
     */
    var YouTubeModel = AbstractModel.extend({
        parse : function(response, options) {
            var res = response.snippet;

            res.kind = response.id.kind;
            res.videoId = response.id.videoId;
            return res;
        }
    });

    module.exports = YouTubeModel;
});
