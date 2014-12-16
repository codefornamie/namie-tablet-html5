define(function(require, exports, module) {
    "use strict";

    require("jquery-steps");

    var app = require("app");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var ArticleRegistFileItemView = require("modules/view/posting/news/ArticleRegistFileItemView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var CommonUtil = require("modules/util/CommonUtil");
    var BusinessUtil = require("modules/util/BusinessUtil");
    var moment = require("moment");
    var vexDialog = require("vexDialog");

    /**
     * 記事一覧のViewクラス
     * 
     * @class 記事一覧のViewクラス
     * @exports LetterWizardView
     * @constructor
     */
    var LetterWizardView = ArticleRegistFileItemView.extend({
        /**
         * テンプレート
         * @memberof LetterWizardView#
         */
        template : require("ldsh!templates/{mode}/wizard/letterWizard"),
        /**
         * このクラスのモデル
         * @memberof LetterWizardView#
         */
        model : new ArticleModel(),
        /**
         * Layoutがレンダリングされたら呼ばれる
         * @memberof LetterWizardView#
         */
        afterRendered : function() {
            this.prepareValidate();

            this.$step = this.$el.find(LetterWizardView.SELECTOR_LETTER_WIZARD).steps({
                headerTag : "h3",
                bodyTag : "section",
                transitionEffect : "slideLeft",
                labels : {
                    next : "次へ",
                    previous : "戻る",
                    finish : "投稿する"
                },
                onStepChanging : this.onStepChanging.bind(this),
                onFinishing : this.onFinishing.bind(this),
                onFinished : this.onFinished.bind(this),
            });

            this.$step.find("[href='#previous']").addClass("button button--gray");
            this.$step.find("[href='#next']").addClass("button");
            this.$step.find("[href='#finish']").addClass("button");
            
            $(".contents-wrapper").css("overflow", "hidden");

            FileAPIUtil.bindFileInput(this.$el.find("#articleFile"));
        },

        /**
         * 初期化する
         * @memberof LetterWizardView#
         */
        initialize : function() {
            this.initEvents();

            // 初期画面
            this.moveTo(1);
        },

        /**
         * イベントを初期化する
         * @memberof LetterWizardView#
         */
        initEvents : function() {
            this.listenTo(app.router, "route", this.onRoute);
        },

        /**
         * ウィザード内の指定のページヘ移動する
         * @param {Number} expectedStep
         * @memberof LetterWizardView#
         */
        moveTo : function(expectedStep) {
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
        onRoute : function(route, params) {
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
        onStepChanging : function(ev, currentIndex, newIndex) {
            if (this.form.valid()) {
                // this.moveTo()が再帰的に呼び出されてしまうのを防ぐ
                if (this._isMoving) {
                    return true;
                }

                if (!this.file) {
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert("画像が未選択です。");

                    return false;
                }

                this.setConfirmLabel();

                this._isMoving = true;
                this.moveTo(newIndex + 1);
            } else {
                this._isMoving = false;
                return false;
            }

        },

        /**
         * ウィザードを終了する前に呼ばれる
         * @param {Event} ev
         * @param {Number} currentIndex
         * @return {Boolean} trueならば実際の移動を許可する
         * @memberof LetterWizardView#
         */
        onFinishing : function(ev, currentIndex) {
            return this.form.valid();
        },

        /**
         * ウィザードを終了した後に呼ばれる
         * @param {Event} ev
         * @param {Number} currentIndex
         * @memberof LetterWizardView#
         */
        onFinished : function(ev, currentIndex) {
            this.showLoading();
            this.setInputValue();
             this.saveLetterPicture();
        },
        /**
         * バリデータの初期化処理を行う
         * @memberof LetterWizardView#
         */
        prepareValidate : function() {
            this.form = $("#letter-form");
            this.form.validate();
        },
        /**
         * 確認画面にインプットデータをセットする関数
         * @memberof LetterWizardView#
         */
        setConfirmLabel : function() {
            $("#confirmTitle").text($("#letter-wizard-form__title").val());
            $("#confirmDescription").html(CommonUtil.sanitizing($("#letter-wizard-form__body").val()));
            $("#confirmNickname").text($("#letter-wizard-form__nickname").val());
        },
        /**
         * モデルにデータをセットする関数
         * @memberof LetterWizardView#
         */
        setInputValue : function() {
            this.model.set("type", "6");
            this.model.set("site", "おたより");
            this.model.set("title", $("#letter-wizard-form__title").val());
            this.model.set("description", $("#letter-wizard-form__body").val());
            this.model.set("nickname", $("#letter-wizard-form__nickname").val());
            this.model.set("imageUrl", this.generateFileName(this.file.name));
            this.model.set("createUserId", app.user.get("__id"));

            // 配信日は固定で翌日とする
            var prePublishedAt = BusinessUtil.getCurrentPublishDate();
            this.model.set("publishedAt", moment(prePublishedAt).add(1, "d").format("YYYY-MM-DD"));
        },
        /**
         * ファイル読み込み後に行う拡張処理
         * @memberof LetterWizardView#
         * @param {Event} ファイルロードイベント
         */
        onLoadFileExtend : function(ev, file) {
            this.file = file;
            this.file.data = ev.target.result;
            $("#letterPicture").attr("src", $("#previewFile").attr("src"));
        },
        /**
         * ファイル名を元に、ユニークなID付きのファイル名を生成する
         * 
         * @memberof LetterWizardView#
         * @param {String} fileName ファイル名
         * @return {String} 生成したファイルパス名
         */
        generateFileName : function(fileName) {
            var preName = fileName.substr(0, fileName.lastIndexOf("."));
            var suffName = fileName.substr(fileName.lastIndexOf("."));

            return preName + "_" + new Date().getTime() + _.uniqueId("") + suffName;
        },
        /**
         * 削除ボタン押下時のハンドラ
         * @memberof LetterWizardView#
         */
        onClickFileDeleteButton : function() {
            // fileインプットと画像プレビューのリセット
            $(this.el).find("#articleFile").val("");
            $(this.el).find("#previewFile").attr("src", "");
            $(this.el).find("#previewFile").hide();
            $(this.el).find("#fileDeleteButton").hide();
            this.file = null;
        },
        /**
         * 添付された画像をdavへ登録する
         * @memberof LetterWizardView#
         */
        saveLetterPicture : function() {
            app.box.col("dav").put(this.model.get("imageUrl"), {
                body : this.file.data,
                headers : {
                    "Content-Type" : this.file.type,
                    "If-Match" : "*"
                },
                success : $.proxy(function(e) {
                    this.saveModel();
                }, this),
                error : $.proxy(function(e) {
                    this.hideLoading();
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert("保存に失敗しました。");
                    app.logger.error("保存に失敗しました。");
                }, this)
            });
        },
        /**
         * Modelの保存
         * @memberof LetterWizardView#
         */
        saveModel : function(){
            this.model.save(null, {
                success : $.proxy(function() {
                    this.hideLoading();
                    app.router.go('/letters');
                }, this),
                error: function(e){
                    this.hideLoading();
                    vexDialog.alert("保存に失敗しました。");
                    app.logger.error("保存に失敗しました。");
                }
            });
        },

        /**
         * ビューが破棄される時に呼ばれる
         */
        cleanup: function () {
            $(".contents-wrapper").css("overflow", "");
        },
    }, {
        /**
         * ウィザードのセレクタ
         */
        SELECTOR_LETTER_WIZARD : "#letter-wizard-pages"
    });

    module.exports = LetterWizardView;
});