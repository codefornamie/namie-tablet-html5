define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var YouTubeView = Backbone.Layout.extend({
        template : require("ldsh!/app/templates/top/youTubeItem"),
        serialize : function() {
            return {
                model : this.model
            };
        },
        beforeRender : function() {

        },

        afterRender : function() {

        },
        /**
         * 初期化処理
         */
        initialize : function() {

        }

    });

    module.exports = YouTubeView;
});
