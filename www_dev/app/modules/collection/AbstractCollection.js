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
         * @memberOf AbstractCollection#
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
         * @memberOf AbstractCollection#
         */
        parseResponse : function(response, options) {
            return response;
        }
    });

    module.exports = AbstractCollection;
});
