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
    var AbstractCollection = require("modules/collection/AbstractCollection");
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");

    /**
     * 道場の◯◯編のコレクションクラス
     * 
     * @class 道場の◯◯編のコレクションクラス
     * @exports DojoEditionCollection
     * @constructor
     */
    var DojoEditionCollection = AbstractCollection.extend({
        model : DojoEditionModel,
        
        /**
         * 現在表示中の edition のインデックス
         * @memberOf DojoEditionCollection#
         */
        _currentEditionIndex: 0,
        
        /**
         * 初期化処理
         * @memberOf DojoEditionCollection#
         */
        initialize: function () {
        },

        /**
         * 現在表示中の DojoEditionModel を返す
         * @memberOf DojoEditionCollection#
         * @return {DojoEditionModel} 道場編毎モデル
         */
        getCurrentEdition: function () {
            var model = this.models[0];
            var models = model && model.get("models");
            var edition = models && models[this._currentEditionIndex];

            return edition;
        },

        /**
         * 表示する edition のインデックスを変更する
         * @param {Number} index
         * @memberOf DojoEditionCollection#
         */
        setEditionIndex: function (index) {
            this._currentEditionIndex = index || 0;
            this.trigger("edition");
        }
    });

    module.exports = DojoEditionCollection;
});