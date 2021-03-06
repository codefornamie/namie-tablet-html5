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
    var DojoListView = require("modules/view/dojo/top/DojoListView");
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");
    var Code = require("modules/util/Code");

    /**
     * 道場アプリのコース内コンテンツ一覧画面のLayout
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @constructor
     */
    var DojoLevelLayout = Backbone.Layout.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberOf DojoLevelView#
         */
        template : require("ldsh!templates/{mode}/top/dojoLevel"),

        events: {"click #dojoTopAnchor": "clickDojoTop"},
        clickDojoTop: function() {
            app.ga.trackEvent("コース内の動画選択ページ", "「コース選択に戻る」ボタン押下");
        },
        /**
         * テンプレートに渡す情報をシリアライズする
         * @return {Object}
         */
        serialize : function() {
            var level = _.clone(Code.DOJO_LEVELS[this.level.get("level")]);
            var contents = this.dojoEditionModel.getModelsByLevel(this.level.get("level"));
            var numContent = 0;
            var numSolved = 0;

            numContent = contents.length;

            _(contents).each(function (content) {
                if (content.getSolvedState() === Code.DOJO_STATUS_SOLVED) {
                    numSolved++;
                }
            });

            level.numContent = numContent;
            level.numSolved = numSolved;

            return {
                level : level
            };
        },

        /**
         * 初期化
         * @param {Object} param
         * @memberOf DojoLevelView#
         */
        initialize : function(param) {
            console.assert(param, "param should be specified");
            console.assert(param.dojoEditionModel, "param.dojoEditionModel should be specified");

            this.dojoEditionModel = param.dojoEditionModel;
        },

        /**
         * Layoutの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberOf DojoLevelView#
         */
        beforeRender : function() {
        },

        /**
         * Layoutの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf DojoLevelView#
         */
        afterRender : function() {
            if (this.dojoEditionModel && this.dojoEditionModel.get("contentCollection")) {
                var dojoListView = new DojoListView({
                    dojoEditionModel: this.dojoEditionModel,
                    level: this.level
                });

                this.setView("#dojo-list-container", dojoListView).render();
            }
        }
    });

    /**
     * 道場アプリのトップ画面を表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports DojoLevelView
     * @constructor
     */
    var DojoLevelView = AbstractView.extend({
        /**
         * 初期化
         * @param {Object} param 初期化処理オブション情報
         * @memberOf DojoLevelView#
         */
        initialize : function(param) {
            console.assert(param, "param should be specified");
            console.assert(param.dojoEditionModel, "param.dojoEditionModel should be specified");

            this.model = new Backbone.Model();
            this.layout = new DojoLevelLayout({
                dojoEditionModel: param.dojoEditionModel
            });
            
            this.initEvent();
        },

        /**
         * イベントを初期化する
         * @memberOf DojoLevelView#
         */
        initEvent: function () {
            this.listenTo(this.model, "change:level", this.onChangeLevel);
        },

        /**
         * レベルが変更されたら呼ばれる
         * @param {String} level
         * @memberOf DojoLevelView#
         */
        onChangeLevel: function (level) {
            this.layout.level = level;
        }
    });

    module.exports = DojoLevelView;
});
