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
                    previous : "前にもどる",
                    finish : "閉じる"
                },
                //onStepChanging : this.onStepChanging.bind(this),
                //onFinishing : this.onFinishing.bind(this),
                //onFinished : this.onFinished.bind(this),
            });

            this.$step.find("[href='#previous']").addClass("button button--gray");
            this.$step.find("[href='#next']").addClass("button");
            this.$step.find("[href='#finish']").addClass("button");
        },

        initialize : function() {

        },

        events : {
            "click #global-help" : "onClickOverlay",
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
