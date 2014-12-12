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
        /**
         * @memberof LetterWizardView#
         */
        template : require("ldsh!templates/{mode}/wizard/letterWizard"),

        /**
         * Layoutがレンダリングされたら呼ばれる
         * @memberof LetterWizardView#
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
                onFinishing: this.onFinishing.bind(this),
                onFinished: this.onFinished.bind(this),
            });

            this.$step.find("[href='#previous']").addClass("button button--gray");
            this.$step.find("[href='#next']").addClass("button");
            this.$step.find("[href='#finish']").addClass("button");
        },

        /**
         * 初期化する
         * @memberof LetterWizardView#
         */
        initialize: function () {
            this.initEvents();

            // 初期画面
            this.moveTo(1);
        },

        /**
         * イベントを初期化する
         * @memberof LetterWizardView#
         */
        initEvents: function () {
            this.listenTo(app.router, "route", this.onRoute);
        },

        /**
         * ウィザード内の指定のページヘ移動する
         * @param {Number} expectedStep
         * @memberof LetterWizardView#
         */
        moveTo: function (expectedStep) {
            expectedStep = +expectedStep;

            if (this.$step) {
                var actualStep;

                // ウィザード終了時にgetCurrentIndexが例外を投げるので応急処置
                try {
                    actualStep = this.$step.steps("getCurrentIndex") + 1;
                } catch (e) {
                    return;
                }

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
                // ルーティングによって呼ばれた場合は新たなルーティングを行わない
                if (!this._isRouting) {
                    app.router.navigate("/letters/new?step=" + expectedStep);
                }

                this._isMoving = false;
            }
        },

        /**
         * ルーティング時に呼ばれる
         * @param {String} route
         * @param {Array} params
         * @memberof LetterWizardView#
         */
        onRoute: function (route, params) {
            var queryString = params[1];
            var query = app.router.parseQueryString(queryString);
            var step = query.step;

            this._isRouting = true;
            this.moveTo(step);
            this._isRouting = false;
        },

        /**
         * ウィザード画面を移動する前に呼ばれる
         * @param {Event} ev
         * @param {Number} currentIndex
         * @param {Number} newIndex
         * @return {Boolean} trueならば実際の移動を許可する
         * @memberof LetterWizardView#
         */
        onStepChanging: function (ev, currentIndex, newIndex) {
            // this.moveTo()が再帰的に呼び出されてしまうのを防ぐ
            if (this._isMoving) {
                return true;
            }

            this._isMoving = true;
            this.moveTo(newIndex + 1);
        },

        /**
         * ウィザードを終了する前に呼ばれる
         * @param {Event} ev
         * @param {Number} currentIndex
         * @return {Boolean} trueならば実際の移動を許可する
         * @memberof LetterWizardView#
         */
        onFinishing: function (ev, currentIndex) {
            // TODO バリデーション処理などを行う？
            return true;
        },

        /**
         * ウィザードを終了した後に呼ばれる
         * @param {Event} ev
         * @param {Number} currentIndex
         * @memberof LetterWizardView#
         */
        onFinished: function (ev, currentIndex) {
            // TODO 実際の処理を行う
            alert("送信しました！（DUMMY）");
            app.router.go('/letters');
        }
    }, {
        /**
         * ウィザードのセレクタ
         */
        SELECTOR_LETTER_WIZARD : "#letter-wizard-pages"
    });

    module.exports = LetterWizardView;
});