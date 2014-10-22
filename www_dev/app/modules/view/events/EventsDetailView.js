define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    
    var EventsDetailView = AbstractView.extend({
        template : require("ldsh!/app/templates/events/eventsDetail"),
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

    module.exports = EventsDetailView;
});
