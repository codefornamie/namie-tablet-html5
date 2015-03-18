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
    var AbstractView = require("modules/view/AbstractView");
    var Code = require("modules/util/Code");
    
    /**
     * ヘッダのViewクラスを作成する。
     * 
     * @class ヘッダのViewクラス
     * @exports HeaderView
     * @constructor
     */
    var HeaderView = AbstractView.extend({
        template : require("ldsh!templates/dojo/top/header"),

        /**
         * Viewの描画処理の後に呼び出されるコールバック関数。
         * @memberOf HeaderView#
         */
        afterRendered : function() {
            this.renderCurrentLevel();
        },

        /**
         * 初期化
         * @param {Object} param
         * @memberOf HeaderView#
         */
        initialize : function(param) {
            console.assert(param.dojoContentCollection, "param.dojoContentCollection should be specified");

            this.dojoContentCollection = param.dojoContentCollection;

            this.listenTo(this.dojoContentCollection, "achievement", this.onUpdateLevel);
        },

        /**
         * 現在の段位をレンダリングする
         * @memberOf HeaderView#
         */
        renderCurrentLevel: function () {
            var notAchievementedLevel = this.dojoContentCollection.getNotAchievementedLevel();
            var level = Code.DOJO_LEVELS[notAchievementedLevel];

            this.$el.find("#dojo-account__level").attr("data-dojo-level", level.className);
            this.$el.find("#dojo-account__level-name").text(level.levelName);
        },

        /**
         * 段位情報が更新されたら呼ばれる
         * @memberOf HeaderView#
         */
        onUpdateLevel: function () {
            this.renderCurrentLevel();
        }
    });

    module.exports = HeaderView;
});
