/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
