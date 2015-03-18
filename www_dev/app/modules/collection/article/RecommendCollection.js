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
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var RecommendModel = require("modules/model/article/RecommendModel");
    var DateUtil = require("modules/util/DateUtil");
    var Equal = require("modules/util/filter/Equal");
    var Ge = require("modules/util/filter/Ge");
    var Le = require("modules/util/filter/Le");
    var And = require("modules/util/filter/And");
    var Or = require("modules/util/filter/Or");
    var IsNull = require("modules/util/filter/IsNull");

    /**
     * おすすめ情報のコレクションクラス
     *
     * @class おすすめ情報のコレクションクラス
     * @exports RecommendCollection
     * @constructor
     */
    var RecommendCollection = AbstractODataCollection.extend({
        model : RecommendModel,
        /**
         * 操作対象のEntitySet名
         * @memberOf RecommendCollection#
         */
        entity : "recommend",
        /**
         * 初期化処理
         * @memberOf RecommendCollection#
         */
        initialize : function() {
            this.condition = {
                top : 10
            };
        },

        /**
         * 記事の検索条件を指定する。
         * @param {Object} 検索条件。現在、targetDateプロパティにDateオブジェクトを指定可能。
         * @memberOf RecommendCollection#
         */
        setSearchCondition : function(condition) {
            var targetDate = condition.targetDate;
            var dateString = DateUtil.formatDate(targetDate, "yyyy-MM-dd");

            this.condition.filters = [
                new Or([
                    new Equal("publishedAt", dateString), new And([
                        new Le("publishedAt", dateString), new Ge("depublishedAt", dateString)
                    ])
                ])
            ];
        }
    });

    module.exports = RecommendCollection;
});
