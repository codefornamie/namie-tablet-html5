define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var YouTubeView = require("modules/view/top/YouTubeView");

    var TopView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/top/top"),


        beforeRendered : function() {

        },

        afterRendered : function() {
            app.ga.trackPageView("Top","新聞アプリ/TOPページ");
        },
    });

    module.exports = TopView;
});
