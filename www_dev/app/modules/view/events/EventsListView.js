define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var EventsCollection = require("modules/collection/events/EventsCollection");
    var EventsListItemView = require("modules/view/events/EventsListItemView");

    var EventsListView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/events/eventsList"),

        beforeRendered : function() {
            this.setEventsList();
        },

        afterRendered : function() {

        },
        /**
         * 初期化処理
         */
        initialize : function() {

        },
        /**
         * 取得した動画一覧を描画する
         */
        setEventsList : function() {
            var self = this;
            this.collection.each($.proxy(function(model) {
            	if (!model.get("eventDate")) { return; }

                this.insertView("#eventsList", new EventsListItemView({
                    model : model,
                }));
            }, this));

        }
    });

    module.exports = EventsListView;
});
