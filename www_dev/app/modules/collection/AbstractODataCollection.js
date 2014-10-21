define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractCollection = require("modules/collection/AbstractCollection");
    var AbstractODataCollection = AbstractCollection.extend({
        cell : "namiedev01",
        box : "box1",
        odata : "odata01",
        entity : "entity01",
        condition : {
            top : 100
        },
        parseResponse: function (response, options) {
            response = this.parseOData(response, options);
            return response;
        },
        parseOData: function (response, options) {
            return response;
        },
        sync : function(method, model, options) {
            if (!options) {
                options = {};
            }
            // dc1-clientによるODataアクセスを行う
            var odataCollection = app.accessor.cell(this.cell).box(this.box).odata(this.odata);
            this.entityset = odataCollection.entitySet(this.entity);

            var complete = function(res) {
                // 取得したJSONオブジェクト
                var json = null;
                if (res.error) {
                    if (options.error) {
                        options.error(res);
                    }
                } else if (options.success) {
                    if (res.bodyAsJson) {
                        json = res.bodyAsJson();
                    }
                    if (json && json.d) {
                        json = json.d.results;
                    }
                    options.success(json);
                }

                if (options.complete) {
                    options.complete(res, model, json);
                }
            };
            this.search(method, model, options, complete);
        },
        search : function(method, model, options, complete) {
            this.entityset.query().filter(this.condition.filter).top(this.condition.top).run({
                complete : function(response) {
                    complete(response);
                }
            });
        }

    });

    module.exports = AbstractODataCollection;
});
