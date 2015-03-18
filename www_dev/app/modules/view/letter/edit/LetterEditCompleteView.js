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
     * 記事編集完了画面のViewクラス
     * 
     * @class 記事編集完了画面のViewクラス
     * @exports LetterEditCompleteView
     * @constructor
     */
    var LetterEditCompleteView = AbstractView.extend({
        /**
         * @memberOf LetterEditCompleteView#
         */
        template : require("ldsh!templates/{mode}/edit/letterEditComplete"),

        /**
         * Layoutがレンダリングされたら呼ばれる
         * @memberOf LetterEditCompleteView#
         */
        afterRendered : function() {
        },

        /**
         * 初期化する
         * @memberOf LetterEditCompleteView#
         * @param {Object} param
         */
        initialize : function(param) {
            console.assert(param, "param should be specified");
            console.assert(param.letterModel, "param.letterModel should be specified");

            this.model = param.letterModel;
        }
    });

    module.exports = LetterEditCompleteView;
});