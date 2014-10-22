define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
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
                success : function(binary) {
                    var arrayBufferView = new Uint8Array(binary);
                    var blob = new Blob([ arrayBufferView ], {
                        type : "image/jpg"
                    });
                    var url = FileAPIUtil.createObjectURL(blob);
                    var imgElement = self.$el.find("img");
                    imgElement.load(function() {
                        window.URL.revokeObjectURL(imgElement.attr("src"));
                    });
                    imgElement.attr("src", url);
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
