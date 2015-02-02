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
            app.ga.trackPageView("News/Help","新聞アプリ/ヘルプページ");

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
            app.ga.trackEvent("新聞アプリ/ヘルプページ", "ヘルプ記事参照", currentIndex + 1);
        },

        /**
         * ページが移動した時に呼ばれる
         * @memberOf TutorialView#
         * @param {Event} ev
         * @param {number} currentIndex
         * @param {number} priorIndex
         */
        onStepChanged: function (ev, currentIndex, priorIndex) {
            app.ga.trackEvent("新聞アプリ/ヘルプページ", "ヘルプ記事参照", currentIndex + 1);
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

            app.ga.trackEvent("新聞アプリ/ヘルプページ", "閉じる（右上）", "");

            this.trigger("closeGlobalHelp");
        },

        /**
         * 閉じるボタンをクリックした時に呼ばれる
         * @memberOf TutorialView#
         * @param {Event} ev
         */
        onFinishing: function (ev) {
            if (ev.currentTarget.id === "global-help-pages") {
                app.ga.trackEvent("新聞アプリ/ヘルプページ", "ヘルプ記事内の項目「閉じる」", "");
            } else {
                app.ga.trackEvent("新聞アプリ/ヘルプページ", "閉じる（右上）", "");
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
