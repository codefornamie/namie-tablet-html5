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

    /**
     * 遷移先選択画面のViewクラス
     * 
     * @class 遷移先選択画面のViewクラス
     * @exports LetterSelectView
     * @constructor
     */
    var LetterSelectView = AbstractView.extend({
        /**
         * @memberOf LetterSelectView#
         */
        template : require("ldsh!templates/{mode}/select/letterSelect"),

        /**
         * Layoutがレンダリングされたら呼ばれる
         * @memberOf LetterSelectView#
         */
        afterRendered : function() {
        },

        /**
         * イベント一覧
         * @memberOf LetterSelectView#
         */
        events : {},

        /**
         * 初期化する
         * @memberOf LetterSelectView#
         */
        initialize : function() {
        }
    });

    module.exports = LetterSelectView;
});