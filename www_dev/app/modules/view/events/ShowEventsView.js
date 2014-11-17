define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var EventsCollection = require("modules/collection/events/EventsCollection");
    var EventsListView = require("modules/view/events/EventsListView");
    var EventsDetailView = require("modules/view/events/EventsDetailView");

    var EventsView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/events/showEvents"),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {
            this.collection = new EventsCollection();

            var eventsListView = new EventsListView();
            eventsListView.collection = this.collection;
            this.setView(".event-list", eventsListView);

            eventsListView.listenTo(this.collection, "reset sync request", eventsListView.render);
            
            this.collection.fetch();
        },

        events : {
            "click .eventsListItem" : "onClickEventsList"
        },

        onClickEventsList : function(ev) {
            var eventsId = $(ev.currentTarget).attr("data-events-id");
            var events = this.collection.find(function(item) {
                return item.get('__id') === eventsId;
            });
            this.setEvents(events);
        },
        setEvents : function(events) {
            this.setView(".event-detail", new EventsDetailView({
            	model: events
            })).render();
        }

    });
    module.exports = EventsView;
});
