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

    require("jquery-steps");

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var TutorialView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/tutorial/tutorial"),
        beforeRendered : function() {

        },

        afterRendered : function() {
            app.ga.trackPageView("Help","ヘルプページ");

            this.$step = this.$el.find(TutorialView.SELECTOR_GLOBAL_HELP).steps({
                headerTag : "h3",
                bodyTag : "section",
                transitionEffect : "none",
                labels : {
                    next : "次へ",
                    previous : "前に戻る",
                    finish : "閉じる"
                },
                onInit : this.onInit.bind(this),
                //onStepChanging : this.onStepChanging.bind(this),
                onStepChanged : this.onStepChanged.bind(this),
                onFinishing : this.onFinishing.bind(this),
                //onFinished : this.onFinished.bind(this),
            });

            this.$step.find("[href='#previous']").addClass("button button--gray");
            this.$step.find("[href='#next']").addClass("button button--red");
            this.$step.find("[href='#finish']").addClass("button button--red");
        },

        initialize : function() {
            $(document).trigger("open:modal");
        },

        /**
         * Viewが破棄される時に呼ばれる
         * @memberOf TutorialView#
         */
        cleanup : function () {
            $(document).trigger("close:modal");
        },

        events : {
            "click #global-help" : "onClickOverlay",
            "click [data-close]" : "onFinishing"
        },

        /**
         * ウィザードの初期化が完了した時に呼ばれる
         * @memberOf TutorialView#
         * @param {Event} ev
         * @param {number} currentIndex
         */
        onInit: function (ev, currentIndex) {
            app.ga.trackEvent("ヘルプページ", "ヘルプ記事参照", currentIndex + 1);
        },

        /**
         * ページが移動した時に呼ばれる
         * @memberOf TutorialView#
         * @param {Event} ev
         * @param {number} currentIndex
         * @param {number} priorIndex
         */
        onStepChanged: function (ev, currentIndex, priorIndex) {
            app.ga.trackEvent("ヘルプページ", "ヘルプ記事参照", currentIndex + 1);
        },

        /**
         * オーバレイをクリックした時に呼ばれる
         * @memberOf TutorialView#
         * @param {Event} ev
         */
        onClickOverlay : function (ev) {
            // オーバーレイの背景部分をタップした場合のみ処理する
            if (!$(ev.target).is("#global-help")) {
                return;
            }

            app.ga.trackEvent("ヘルプページ", "閉じる（右上）", "");

            this.trigger("closeGlobalHelp");
        },

        /**
         * 閉じるボタンをクリックした時に呼ばれる
         * @memberOf TutorialView#
         * @param {Event} ev
         */
        onFinishing: function (ev) {
            if (ev.currentTarget.id === "global-help-pages") {
                app.ga.trackEvent("ヘルプページ", "ヘルプ記事内の項目「閉じる」", "");
            } else {
                app.ga.trackEvent("ヘルプページ", "閉じる（右上）", "");
            }

            this.trigger("closeGlobalHelp");
        }
    }, {
        /**
         * ウィザードのセレクタ
         */
        SELECTOR_GLOBAL_HELP : "#global-help-pages"
    });

    module.exports = TutorialView;
});
