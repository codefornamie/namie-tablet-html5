define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var AchievementModel = require("modules/model/misc/AchievementModel");

    /**
     * 達成情報のコレクションクラス
     * 
     * @class 達成情報のコレクションクラス
     * @exports AchievementCollection
     * @constructor
     */
    var AchievementCollection = AbstractODataCollection.extend({
        model : AchievementModel,
        /**
         * 操作対象のEntitySet名
         * @memberOf AchievementCollection#
         */
        entity : "achievement",
        /**
         * 検索条件
         * @memberOf AchievementCollection#
         */
        condition : {
            top : 100,
        },
        parseOData : function(response, options) {
            return response;
        },
    });

    module.exports = AchievementCollection;
});
