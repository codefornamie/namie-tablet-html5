define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractModel = require("modules/model/AbstractModel");
    var DateUtil = require("modules/util/DateUtil");
    var CommonUtil = require("modules/util/CommonUtil");
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

            res.__id = response.id.videoId;
            res.kind = response.id.kind;
            res.videoId = response.id.videoId;
            res.dispCreatedAt = DateUtil.formatDate(new Date(res.publishedAt), "yyyy年MM月dd日 HH時mm分");
            res.thumbnail = res.thumbnails["high"].url;
            res.dispTitle = CommonUtil.sanitizing(res.title);

            return res;
        }
    });

    module.exports = YouTubeModel;
});