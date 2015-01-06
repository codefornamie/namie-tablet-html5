define(function(require, exports, module) {
    "use strict";

    require("jquery-steps");

    var app = require("app");
    var AbstractModel = require("modules/model/AbstractModel");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var WebDavModel = require("modules/model/WebDavModel");
    
    var ArticleRegistFileItemView = require("modules/view/posting/news/ArticleRegistFileItemView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var CommonUtil = require("modules/util/CommonUtil");
    var BusinessUtil = require("modules/util/BusinessUtil");
    var moment = require("moment");
    var vexDialog = require("vexDialog");
    var canvasToBlob = require("canvas-to-blob");

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
         * @memberOf LetterWizardView#
         */
        template : require("ldsh!templates/{mode}/wizard/letterWizard"),
        /**
         * このクラスのモデル
         * @memberOf LetterWizardView#
         */
        model : new ArticleModel(),
        /**
         * Layoutがレンダリングされたら呼ばれる
         * @memberOf LetterWizardView#
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
         * @memberOf LetterWizardView#
         */
        initialize : function() {
            this.initEvents();

            // 初期画面
            this.moveTo(1);
        },

        /**
         * イベントを初期化する
         * @memberOf LetterWizardView#
         */
        initEvents : function() {
            this.listenTo(app.router, "route", this.onRoute);
        },

        /**
         * ウィザード内の指定のページヘ移動する
         * @param {Number} expectedStep
         * @memberOf LetterWizardView#
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
         * @memberOf LetterWizardView#
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
         * @memberOf LetterWizardView#
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
         * @memberOf LetterWizardView#
         */
        onFinishing : function(ev, currentIndex) {
            return this.form.valid();
        },

        /**
         * ウィザードを終了した後に呼ばれる
         * @param {Event} ev
         * @param {Number} currentIndex
         * @memberOf LetterWizardView#
         */
        onFinished : function(ev, currentIndex) {
            this.showLoading();
            this.setInputValue();
             this.saveLetterPicture();
        },
        /**
         * バリデータの初期化処理を行う
         * @memberOf LetterWizardView#
         */
        prepareValidate : function() {
            this.form = $("#letter-form");
            this.form.validate({
                submitHandler : function() {
                    return false;
                },
                invalidHandler : function() {
                    return false;
                }
            });
        },
        /**
         * 確認画面にインプットデータをセットする関数
         * @memberOf LetterWizardView#
         */
        setConfirmLabel : function() {
            $("#confirmTitle").text($("#letter-wizard-form__title").val());
            $("#confirmDescription").html(CommonUtil.sanitizing($("#letter-wizard-form__body").val()));
            $("#confirmNickname").text($("#letter-wizard-form__nickname").val());
        },
        /**
         * モデルにデータをセットする関数
         * @memberOf LetterWizardView#
         */
        setInputValue : function() {
            this.model.set("type", "6");
            this.model.set("site", "おたより");
            this.model.set("title", $("#letter-wizard-form__title").val());
            this.model.set("description", $("#letter-wizard-form__body").val());
            this.model.set("nickname", $("#letter-wizard-form__nickname").val());
            var imageUrl = this.generateFileName(this.file.name);
            this.model.set("imageUrl", imageUrl);
            this.model.set("imageUrlThmb", imageUrl + ".thmb");
            this.model.set("createUserId", app.user.get("__id"));

            // 配信日は固定で翌日とする
            var prePublishedAt = BusinessUtil.getCurrentPublishDate();
            this.model.set("publishedAt", moment(prePublishedAt).add(1, "d").format("YYYY-MM-DD"));
        },
        /**
         * ファイル読み込み後に行う拡張処理
         * @memberOf LetterWizardView#
         * @param {Event} ファイルロードイベント
         */
        onLoadFileExtend : function(ev, file) {
            this.file = file;
            this.file.data = ev.target.result;
            this.makeThmbnail(this.file.data, $.proxy(function(blob){
                this.file.thmb = blob;
            }, this));
            $("#letterPicture").attr("src", $("#previewFile").attr("src"));
        },
        /**
         * 削除ボタン押下時のハンドラ
         * @memberOf LetterWizardView#
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
         * @memberOf LetterWizardView#
         */
        saveLetterPicture : function() {
            if(!this.model.get("__id")){
                this.model.id = AbstractModel.createNewId();
            }
            if(!this.model.get("imagePath")){
                this.model.set("imagePath", this.generateFilePath());
            }

            // コールバックの定義
            var count = 2;
            var success = $.proxy(function(e) {
                if(--count <= 0){
                    this.saveModel();
                }
            }, this);
            var error = $.proxy(function(e) {
                this.hideLoading();
                vexDialog.defaultOptions.className = 'vex-theme-default';
                vexDialog.alert("保存に失敗しました。");
                app.logger.error("保存に失敗しました。");
            }, this);

            // 元画像の保存
            var davModel = new WebDavModel();
            davModel.set("path", this.model.get("imagePath"));
            davModel.set("fileName", this.model.get("imageUrl"));
            davModel.set("data", this.file.data);
            davModel.set("contentType", this.file.type);
            davModel.save(null, {
                success : success,
                error : error
            });

            // サムネイル画像の保存
            var thmbDavModel = new WebDavModel();
            thmbDavModel.set("path", this.model.get("imagePath"));
            thmbDavModel.set("fileName", this.model.get("imageUrl") + ".thmb");
            thmbDavModel.set("data", this.file.thmb);
            thmbDavModel.set("contentType", this.file.type);
            thmbDavModel.save(null, {
                success : success,
                error : error
            });
        },
        /**
         * Modelの保存
         * @memberOf LetterWizardView#
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