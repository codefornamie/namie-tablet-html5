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
    var AchievementModel = require("modules/model/misc/AchievementModel");

    /**
     * 達成情報のコレクションクラス
     * 
     * @class 達成情報のコレクションクラス
     * @exports AchievementCollection
     * @constructor
     */
    var AchievementCollection = AbstractODataCollection.extend({
        model : AchievementModel,
        /**
         * 操作対象のEntitySet名
         * @memberOf AchievementCollection#
         */
        entity : "achievement",
        /**
         * 初期化処理
         * @memberOf AchievementCollection#
         */
        initialize : function() {
            this.condition = {
                    top : 10000
            };
        },
        parseOData : function(response, options) {
            return response;
        },
    });

    module.exports = AchievementCollection;
});
