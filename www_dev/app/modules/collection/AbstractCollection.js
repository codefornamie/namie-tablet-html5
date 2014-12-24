define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    /**
     * 基底コレクションクラス。
     * 
     * @class 基底コレクションクラス。
     * @exports AbstractCollection
     * @constructor
     */
    var AbstractCollection = Backbone.Collection.extend({
        /**
         * レスポンスのパース処理を行う
         * @param {Object} レスポンス情報
         * @param {Object} オプション
         * @return {Object} レスポンス情報
         * @memberof AbstractCollection#
         */
        parse : function parse(response, options) {
            response = this.parseResponse(response, options);
            return response;
        },
        /**
         * レスポンスのパース処理を行う
         * @param {Object} レスポンス情報
         * @param {Object} オプション
         * @return {Object} レスポンス情報
         * @memberof AbstractCollection#
         */
        parseResponse : function(response, options) {
            return response;
        }
    });

    module.exports = AbstractCollection;
});
