define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var MenuView = Backbone.Layout.extend({
        template : require("ldsh!/app/templates/common/menu"),

        beforeRender : function() {

        },

        afterRender : function() {

        },

        initialize : function() {

        },

        events : {
            "click #newsLink" : "onClickNewsLink",
            "click #tvLink" : "onClickTvLink"
        },
        onClickNewsLink : function() {
            app.router.go("news");
        },
        onClickTvLink : function() {
            app.router.go("top");
        }
    });

    module.exports = MenuView;
});
