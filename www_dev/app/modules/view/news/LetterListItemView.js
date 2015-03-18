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
    var GridListItemView = require("modules/view/news/GridListItemView");

    /**
     * 記事一覧の写真投稿コーナーのViewを作成する。
     * 
     * @class 記事一覧の写真投稿コーナーのView
     * @exports LetterListItemView
     * @constructor
     */
    var LetterListItemView = GridListItemView.extend({
        /**
         * このViewのテンプレートファイパス
         * @memberOf LetterListItemView#
         */
        template : require("ldsh!templates/{mode}/news/letterListItem")
    });

    module.exports = LetterListItemView;
});
