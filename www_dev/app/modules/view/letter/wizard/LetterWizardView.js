define(function(require, exports, module) {
    "use strict";

    require("jquery-steps");

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * 記事一覧のViewクラス
     * 
     * @class 記事一覧のViewクラス
     * @exports LetterWizardView
     * @constructor
     */
    var LetterWizardView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/wizard/letterWizard"),

        /**
         * Layoutがレンダリングされたら呼ばれる
         */
        afterRendered : function() {
            this.$step = this.$el.find(LetterWizardView.SELECTOR_LETTER_WIZARD).steps({
                headerTag: "h3",
                bodyTag: "section",
                transitionEffect: "slideLeft",
                labels: {
                    next: "次へ",
                    previous: "戻る",
                    finish: "投稿する"
                },
                onStepChanging: this.onStepChanging.bind(this),
                onFinshed: this.onFinished.bind(this),
            });

            this.$step.find("[href='#previous']").addClass("button button--gray");
            this.$step.find("[href='#next']").addClass("button");
            this.$step.find("[href='#finish']").addClass("button");

            // タブを直接押して切り替えられないようにする
            //this.$step.find("[role='tab']").find("a").attr("href", "");
        },

        /**
         * 初期化する
         */
        initialize: function () {
            this.initEvents();

            // 初期画面
            this.moveTo(1);
        },

        /**
         * イベントを初期化する
         */
        initEvents: function () {
            this.listenTo(app.router, "route", this.onRoute);
        },

        /**
         * ウィザード内の指定のページヘ移動する
         * @param {Number} expectedStep
         */
        moveTo: function (expectedStep) {
            expectedStep = +expectedStep;

            if (this.$step) {
                var actualStep = this.$step.steps("getCurrentIndex") + 1;

                if (expectedStep < actualStep) {
                    while (expectedStep < actualStep) {
                        this.$step.steps("previous");
                        actualStep--;
                    }
                } else if (expectedStep > actualStep) {
                    while (expectedStep > actualStep) {
                        this.$step.steps("next");
                        actualStep++;
                    }
                }

                // URLを更新する
                app.router.navigate("/letters/new?step=" + expectedStep);
            }
        },

        /**
         * ルーティング時に呼ばれる
         * @param {String} route
         * @param {Array} params
         */
        onRoute: function (route, params) {
            var queryString = params[1];
            var query = app.router.parseQueryString(queryString);
            var step = query.step;

            this.moveTo(step);
        },

        /**
         * ウィザード画面を移動するときに呼ばれる
         * @param {Event} ev
         * @param {Number} currentIndex
         * @param {Number} newIndex
         */
        onStepChanging: function (ev, currentIndex, newIndex) {
            if (this.isMoving) {
                this.isMoving = false;
                return true;
            }

            this.isMoving = true;
            this.moveTo(newIndex + 1);
        },

        /**
         * ウィザードを終了すときに
         * @param {Event} ev
         * @param {Number} currentIndex
         */
        onFinished: function (ev, currentIndex) {
            console.log("finish");
        }
    }, {
        /**
         * ウィザードのセレクタ
         */
        SELECTOR_LETTER_WIZARD : "#letter-wizard"
    });

    module.exports = LetterWizardView;
});