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
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");

    /**
     * 道場アプリのトップ画面を表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports DojoTabView
     * @constructor
     */
    var DojoTabView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberOf DojoTabView#
         */
        template : require("ldsh!templates/{mode}/top/dojoTab"),

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberOf DojoTabView#
         */
        beforeRendered : function() {
            // TODO もっと直感的にアクセスできるようにしたい
            var models = this.collection.models;
            var model = models && models[0];
            var editions = [];
            var currentEditionIndex = this.collection._currentEditionIndex;

            if (model) {
                editions = model.get("models");
            }

            this.model = new Backbone.Model({
                editions: editions,
                currentEditionIndex: currentEditionIndex
            });
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf DojoTabView#
         */
        afterRendered : function() {
            this.initEvents();
        },

        /**
         * 初期化
         * @memberOf DojoTabView#
         */
        initialize : function() {
            console.assert(this.collection, "DojoTabView should have a collection");
        },

        /**
         * イベントを初期化する
         * @memberOf DojoTabView#
         */
        initEvents : function() {
            this.$el.off("click.DojoTabView");
            this.$el.on("click.DojoTabView", "[data-select-edition]", this.onSelectEdition.bind(this));
        },

        /**
         * 編のタブをクリックしたら呼ばれる
         * @param {Event} ev
         */
        onSelectEdition: function (ev) {
            var indexAttr = $(ev.currentTarget).attr("data-select-edition");
            var index = parseInt(indexAttr, 10) || 0;

            this.collection.setEditionIndex(index);
        }
    });

    module.exports = DojoTabView;
});
