define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var AchievementModel = require("modules/model/misc/AchievementModel");

    /**
     * 達成情報のコレクションクラス
     * 
     * @class
     * @exports AchievementCollection
     * @constructor
     */
    var AchievementCollection = AbstractODataCollection.extend({
        model : AchievementModel,
        entity : "achievement",
        condition : {
            top : 100,
        },
        parseOData : function(response, options) {
            return response;
        },
    });

    module.exports = AchievementCollection;
});
