define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    
    var EventsListItemView = AbstractView.extend({
        template : require("ldsh!/app/templates/events/eventsListItem"),
        serialize : function() {
            return {
                model : this.model
            };
        },
        beforeRendered : function() {

        },

        afterRendered : function() {
        	var self = this;

        	if (!this.model.get("fileName")) {
        		return;
        	}
            app.box.col("dav").getBinary(this.model.get("fileName"), {
            	success: function (binary) {
            		var arrayBufferView = new Uint8Array( binary );
            		var blob = new Blob([arrayBufferView], { type: "image/jpg" });
            		var url = URL.createObjectURL(blob);
            		
            		self.$el.find("img").attr("src", url);
            	}
            });
        },
        /**
         * 初期化処理
         */
        initialize : function() {

        }

    });

    module.exports = EventsListItemView;
});
