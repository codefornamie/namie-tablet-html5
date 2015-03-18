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
    var NewsView = require("modules/view/news/NewsView");

    /**
     * 運用管理アプリの記事一覧画面を表示するためのViewクラスを作成する。
     * 
     * @class 運用管理アプリの記事一覧画面を表示するためのView
     * @exports OpeNewsPreviewView
     * @constructor
     */
    var OpeNewsPreviewView = NewsView.extend({
        template : require("ldsh!templates/news/news/news"),
        /**
         * プレビューかどうか
         * @memberOf OpeNewsPreviewView#
         */
        isPreview : true,

        /**
         * News一覧の各Gridがクリックされたときの動作
         * 
         * @param {jQuery.Event} ev
         * @param {Object} param
         * @memberOf OpeNewsPreviewView#
         */
        onClickGridItem : function(ev, param) {
            // プレビューのためクリックを無視するため何もしない
        },

    });

    module.exports = OpeNewsPreviewView;
});
