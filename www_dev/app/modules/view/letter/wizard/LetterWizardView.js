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

            // 実機から画像一覧を取得表示
            if (navigator.userAgent.indexOf('Android') >= 0) {
                FileAPIUtil.getGalleryList($.proxy(this.setGalleryList,this));
                $(".onPC").hide();
            } else {
                FileAPIUtil.bindFileInput(this.$el.find("#articleFile"));
                this.hideLoading();
            }
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
                    vexDialog.buttons.YES.text = 'OK';
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
         * 画面にギャラリー一覧を表示する関数
         * @param {Array} fileArray FileEntryオブジェクトの配列
         * @memberOf LetterWizardView#
         */
        setGalleryList : function(fileArray) {
            var urls = [];
            var fileCount = 0;
            if (fileArray.length === 0) {
                var notPicElem = $("<li><div>画像がありません</div></li>");
                $("#gallery-list").append(notPicElem);
                this.hideLoading();
                return;
            }
            _.each(fileArray, $.proxy(function(file) {
                if (file.name.match(/\.jpg$/i)) {
                    // Android撮影画像はjpegのみ
                    var elemString = "<li class='gallery-list__item'><img class='letterImage'></li>"; 
                    var element = $(elemString);
                    element.find("img").load($.proxy(function() {
                        fileCount++;
                        if (fileCount >= fileArray.length) {
                            this.hideLoading();
                            $(this.el).find("img").unbind("click");
                            $(this.el).find("img").click($.proxy(this.onClickGallery,this));
                        }
                    },this));
                    element.find("img").attr("src", file.toURL());
                    element.find("img").data("fileEntry", file);
                    $("#gallery-list").append(element);
                } else {
                    // 動画の場合は共通処理以外は何もしない
                    fileCount++;
                    if (fileCount >= fileArray.length) {
                        this.hideLoading();
                        $(this.el).find("img").unbind("click");
                        $(this.el).find("img").click($.proxy(this.onClickGallery,this));
                    }
                }
            },this));
        },
        /**
         * 画像選択時のハンドラ
         * @param {Event} event 画像クリックイベント
         * @memberOf LetterWizardView#
         */
        onClickGallery : function(event) {
            this.showLoading();
            app.logger.debug("onClickGallery");
            var target = event.target;
            $(target).data("fileEntry").file($.proxy(function(file) {
                app.logger.debug("onClickGallery: file: " + file);
                app.logger.debug("onClickGallery: file.type: " + file.type);
                app.logger.debug("onClickGallery: file.name: " + file.name);

              // ファイルの読み込み
                var reader = new FileReader();
                reader.onload = $.proxy(function(e) {
                    target.data = e.target.result;
                    this.onLoadFileExtend(e, file, target);
                },this);
                reader.readAsArrayBuffer(file);
              
            },this), function(e) {
                // fileでエラー
                app.logger.debug("fileEntry.file(): error" + e.code);
                this.hideLoading();
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
            this.model.set("imageUrl", this.generateFileName(this.file.name));
            this.model.set("createUserId", app.user.get("__id"));

            // 配信日は固定で翌日とする
            var prePublishedAt = BusinessUtil.getCurrentPublishDate();
            this.model.set("publishedAt", moment(prePublishedAt).add(1, "d").format("YYYY-MM-DD"));
        },
        /**
         * ファイル読み込み後に行う拡張処理
         * @memberOf LetterWizardView#
         * @param {Event} ev ファイルロードイベント
         * @param {Object} file ファイルオブジェクト
         * @param {Object} target 選択した画像要素
         */
        onLoadFileExtend : function(ev, file, target) {
            this.hideLoading();
            this.file = file;
            this.file.data = ev.target.result;
            if (navigator.userAgent.indexOf('Android') < 0) {
                $("#letterPicture").attr("src", $("#previewFile").attr("src"));
                return;
            }

            vexDialog.defaultOptions.className = 'vex-theme-default';
            vexDialog.buttons.YES.text = 'これでOK';
            vexDialog.buttons.NO.text = '選びなおす';
            vexDialog.open({
                message : 'この写真でいいですか？',
                input : "<div class='vex-custom-input-wrapper'><img src='" + $(target).attr("src") + "' width='700', height='700'></div>",
                callback : $.proxy(function(value) {
                    var checkElem = $(".checkedPic");
                    checkElem.css("border","none");
                    checkElem.removeClass("checkedPic");
                    if (value) {
                        $("#letterPicture").attr("src", $(target).attr("src"));
                        $(target).css("border","3px solid red");
                        $(target).addClass("checkedPic");
                    } else {
                        this.file = null;
                    }
                    $(".vex-custom-input-wrapper").remove();
                    return;
                },this)
            });
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

            var davModel = new WebDavModel();
            davModel.set("path", this.model.get("imagePath"));
            davModel.set("fileName", this.model.get("imageUrl"));
            
            davModel.set("data", this.file.data);
            davModel.set("contentType", this.file.type);
            
            davModel.save(null, {
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
         * @memberOf LetterWizardView#
         */
        saveModel : function(){
            this.model.save(null, {
                success : $.proxy(function() {
                    $("#gallery-list").empty();
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