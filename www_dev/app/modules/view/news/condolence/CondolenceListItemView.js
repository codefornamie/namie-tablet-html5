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
     * おくやみ一覧の各おくやみ情報を表示するためのViewを作成する。
     * @memberOf CondolenceListView#
     * @class おくやみ一覧アイテムのView
     * @exports CondolenceListItemView
     * @constructor
     */
    var CondolenceListItemView = AbstractView.extend({
        /**
         * このViewを表示する際に利用するテンプレート
         * @memberOf CondolenceListItemView#
         */
        template : require("ldsh!templates/{mode}/news/condolence/condolenceListItem"),
    });

    module.exports = CondolenceListItemView;
});
