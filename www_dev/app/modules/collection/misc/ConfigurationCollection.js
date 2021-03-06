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
    var ConfigurationModel = require("modules/model/misc/ConfigurationModel");

    /**
     * 設定情報のコレクションクラス
     * 
     * @class 設定情報のコレクションクラス
     * @exports ConfigurationCollection
     * @constructor
     */
    var ConfigurationCollection = AbstractODataCollection.extend({
        model : ConfigurationModel,
        entity : "configuration",
        /**
         * 配列をマップに変換する。
         * @return {Objecy} 変換されたマップ
         * @memberOf ConfigurationCollection#
         */
        toMap : function() {
            var map = {};
            for (var i = 0; i < this.models.length; i++) {
                map[this.models[i].id] = this.models[i].get("value");
            }
            // COLOR_LABELに対する前処理
            try{
                // COLOR_LABELのパース
                map.COLOR_LABEL = JSON.parse(map.COLOR_LABEL);
                // 各エントリにidを振る(cssClass名で使用する)
                _.each(map.COLOR_LABEL, function(c, index) {
                    c.id = index;
                });
            } catch(e) {
                app.logger.error("configuration value erorr: COLOR_LABEL");
                map.COLOR_LABEL = {};
            }
            return map;
        },
    });

    module.exports = ConfigurationCollection;
});
