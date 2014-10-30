define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var YouTubeView = require("modules/view/top/YouTubeView");

    var TopView = AbstractView.extend({
        template : require("ldsh!/app/templates/top/top"),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },
    });

    module.exports = TopView;
});
