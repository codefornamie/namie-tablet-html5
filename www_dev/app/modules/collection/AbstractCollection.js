define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var AbstractCollection = Backbone.Collection.extend({
        parse : function parse(response, options) {
            return response.items;
        }
    });

    module.exports = AbstractCollection;
});
