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
     * 記事投稿完了画面のViewクラス
     * 
     * @class 記事投稿完了画面のViewクラス
     * @exports LetterWizardCompleteView
     * @constructor
     */
    var LetterWizardCompleteView = AbstractView.extend({
        /**
         * @memberOf LetterWizardCompleteView#
         */
        template : require("ldsh!templates/{mode}/wizard/letterWizardComplete"),

        /**
         * Layoutがレンダリングされたら呼ばれる
         * @memberOf LetterWizardCompleteView#
         */
        afterRendered : function() {
        },

        /**
         * 初期化する
         * @memberOf LetterWizardCompleteView#
         */
        initialize : function() {
        }
    });

    module.exports = LetterWizardCompleteView;
});