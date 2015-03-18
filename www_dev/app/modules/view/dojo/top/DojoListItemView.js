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
    var Super = AbstractView;

    /**
     * 道場アプリのトップ画面にあるコンテンツを表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports DojoListItemView
     * @constructor
     */
    var DojoListItemView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/top/dojoListItem"),

        /**
         * テンプレートに渡す情報をシリアライズする
         * @memberOf DojoListItemView#
         * @return {Object}
         */
        serialize: function () {
            return _.extend({}, Super.prototype.serialize.call(this), {
                index: this.index
            });
        },

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * @memberOf DojoListItemView#
         */
        beforeRendered : function() {
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf DojoListItemView#
         */
        afterRendered : function() {
            if (this.isNext) {
                this.$el.addClass("is-next");
            }

            if (this.isGrayedOut) {
                this.$el.addClass("is-grayedout").block({
                    message:null,
                    overlayCSS: {opacity: 0}
                });
                this.$el.find(".dojo-item__button").text("まだ再生できません");
            }
        },
        
        /**
         * 初期化
         * @param {Object} param
         * @memberOf DojoListItemView#
         */
        initialize: function (param) {
            console.assert(param, "param should be specified");

            this.index = param.index;
            this.isNext = param.isNext;
            this.isGrayedOut = param.isGrayedOut;
        }
    });

    module.exports = DojoListItemView;
});
