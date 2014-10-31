define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    /**
     * 全てのモデルの基底クラスを作成する。
     * 
     * @class 全てののモデルの基底クラス
     * @exports AbstractModel
     * @constructor
     */
    var AbstractModel = Backbone.Model.extend({
        parse : function (response, options) {
            response = this.parseResponse(response, options);
            return response;
        },
        parseResponse : function(response, options) {
            return response;
        }
    });

    module.exports = AbstractModel;
});
