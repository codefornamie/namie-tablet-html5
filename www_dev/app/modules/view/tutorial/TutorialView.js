define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var TutorialView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/tutorial/tutorial"),
        beforeRendered : function() {

        },

        afterRendered : function() {
            app.ga.trackPageView("Help","新聞アプリ/ヘルプページ");
        },

        initialize : function() {

        },

        events : {
        }

    });
    module.exports = TutorialView;
});
