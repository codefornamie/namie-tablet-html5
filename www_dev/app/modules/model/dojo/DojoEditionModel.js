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
    var AbstractModel = require("modules/model/AbstractModel");

    /**
     * 道場の◯◯編のモデル
     *
     * @class 道場の◯◯編のモデル
     * @exports DojoEditionModel
     * @constructor
     */
    var DojoEditionModel = AbstractModel.extend({
        /**
         * 初期化処理
         * @param {Object} attr
         * @param {Object} param
         * @memberOf DojoEditionModel#
         */
        initialize: function (attr, param) {
        },

        /**
         * 視聴済みコンテンツのモデルを返す
         * @return {Array} 視聴済コンテンツのモデルの配列
         * @memberOf DojoEditionModel#
         */
        getWatchedModels : function() {
            // TODO this.contentCollectionから実際の視聴済みコンテンツを返す
            return [];
        },

        /**
         * 道場コンテンツをレベル指定して取得する
         * @param {String} levelValue
         * @return {Array}
         * @memberOf DojoEditionView#
         */
        getModelsByLevel: function (levelValue) {
            var col;

            // 全ての道場コンテンツを取得する
            col = this.get("contentCollection");

            // sequenceでソートする
            col = col.sortBy(function(model) {
                return parseInt(model.get("sequence"));
            });

            // levelで絞り込む
            col = col.filter(function(model) {
                return (model.get("level") === levelValue);
            }.bind(this));

            return col;
        }
    });

    module.exports = DojoEditionModel;
});