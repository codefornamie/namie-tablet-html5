define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    
    var YouTubeView = AbstractView.extend({
        animation: 'fadeIn',
        template : require("ldsh!templates/{mode}/top/youTubeItem"),
        serialize : function() {
            return {
                model : this.model
            };
        },
        beforeRendered : function() {

        },

        afterRendered : function() {

        },
        /**
         * 初期化処理
         */
        initialize : function() {

        }

    });

    module.exports = YouTubeView;
});
