define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var EventsModel = require("modules/model/events/EventsModel");

    var EventsCollection = AbstractODataCollection.extend({
        model : EventsModel,
        entity : "entity01",
        condition : {
            top : 1000
        },
    });

    module.exports = EventsCollection;
});
