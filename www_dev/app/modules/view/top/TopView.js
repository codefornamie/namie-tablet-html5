define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var TopView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/top/top"),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },
    });

    module.exports = TopView;
});
