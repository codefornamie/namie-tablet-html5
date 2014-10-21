define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var AbstractCollection = Backbone.Collection.extend({
        parse : function parse(response, options) {
            response = this.parseResponse(response, options);
            return response;
        },
        parseResponse : function(response, options) {
            return response;
        }
    });

    module.exports = AbstractCollection;
});
