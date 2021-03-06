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
     * 道場アプリの個別画面にある関連コンテンツのViewクラスを作成する。
     * 
     * @class
     * @exports DojoLessonSiblingsView
     * @constructor
     */
    var DojoLessonSiblingsView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/lesson/dojoLessonSiblings"),

        /**
         * テンプレートに渡す情報をシリアライズする
         * @return {Object}
         */
        serialize: function () {
            return _.extend({}, Super.prototype.serialize.call(this), {
                model: this.dojoContentModel,
                editionModel: this.dojoEditionModel,
                prevContentModel: this.prevContentModel,
                nextContentModel: this.nextContentModel
            });
        },

        beforeRendered : function() {
            // 描画用のmodelを用意する
            var siblings = this.dojoEditionModel.get("contentCollection");
            var index = siblings.pluck("__id").indexOf(this.dojoContentModel.get("__id"));
            var prevModel = siblings.at(index - 1);
            var nextModel = siblings.at(index + 1);

            this.prevContentModel = prevModel;
            this.nextContentModel = nextModel;
        },

        afterRendered : function() {
        },
        
        /**
         * 初期化
         * @param {Object} param
         */
        initialize: function (param) {
            console.assert(param, "param should be specified");
            console.assert(param.dojoEditionModel, "param.dojoEditionModel should be specified");
            console.assert(param.dojoContentModel, "param.dojoContentModel should be specified");
            
            this.dojoEditionModel = param.dojoEditionModel;
            this.dojoContentModel = param.dojoContentModel;
        }
    });

    module.exports = DojoLessonSiblingsView;
});