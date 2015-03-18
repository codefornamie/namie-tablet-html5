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
    var AbstractModel = require("modules/model/AbstractModel");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var WebDavModel = require("modules/model/WebDavModel");

    var ArticleRegistFileItemView = require("modules/view/posting/news/ArticleRegistFileItemView");
    var Code = require("modules/util/Code");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var CommonUtil = require("modules/util/CommonUtil");
    var StringUtil = require("modules/util/StringUtil");
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
        model : null,
        /**
         * Layoutがレンダリングされたら呼ばれる
         * @memberOf LetterWizardView#
         */
        afterRendered : function() {
            app.ga.trackPageView("Wizard", "写真新規投稿ページ");
            
            this.prepareValidate();

            this.$step = this.$el.find(LetterWizardView.SELECTOR_LETTER_WIZARD).steps({
                headerTag : "h3",
                bodyTag : "section",
                transitionEffect : "none",
                labels : {
                    next : "OK",
                    previous : "前にもどる",
                    finish : "投稿する"
                },
                onStepChanging : this.onStepChanging.bind(this),
                onFinishing : this.onFinishing.bind(this),
                onFinished : this.onFinished.bind(this),
            });

            this.$step.find("[href='#previous']").addClass("button button--gray");
            this.$step.find("[href='#next']").addClass("button");
            this.$step.find("[href='#finish']").addClass("button");

            this.updateButtons();

            $(".contents-wrapper").css("overflow", "hidden");
            this.setLocalStorageValue();

            // 実機から画像一覧を取得表示
            if (this.isAndroid) {
                FileAPIUtil.getGalleryList($.proxy(this.setGalleryList, this));
                FileAPIUtil.bindFileInput(this.$el.find("#articleFile"));
            } else {
                FileAPIUtil.bindFileInput(this.$el.find("#articleFile"));
                this.hideLoading();
            }

            // フォームの入力値と確認画面を、モデルのデータを元に設定する
            $("#letter-wizard-form__title").val(this.model.get("title"));
            $("#letter-wizard-form__body").val(this.model.get("description"));
            $("#letter-wizard-form__nickname").val(this.model.get("nickname"));
            this.setConfirmLabel();

            if (this.file) {
                $("#previewFile").attr("src", this.file.dataURL);
                $(".letterPicture").attr("src", this.file.dataURL);
                this.showImageControl();
            }
        },
        /**
         * 写真選択後、対象写真の削除ボタンやプレビュー画像を表示するための要素を表示する。
         * <p>
         * なみえ写真投稿では、写真選択後のプレビュー画像は別の方法で表示するため、この処理はオーバライドして抑止する。
         * </p>
         * @memberOf LetterWizardView#
         */
        showImageControl : function() {
            if (this.isAndroid) {
                return;
            } else {
                $(this.el).find('#previewFile').show();
                $(this.el).find("#fileDeleteButton").show();
            }
        },
        /**
         * 初期化する
         * @memberOf LetterWizardView#
         */
        initialize : function() {
            this.model = new ArticleModel();
            this.initEvents();

            // 実行環境がAndoirdであるかどうか
            this.isAndroid = navigator.userAgent.indexOf('Android') >= 0;

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
                    app.ga.trackPageView("Wizard/step=" + expectedStep, "写真新規投稿ページ");
                    app.router.navigate("/letters/new?step=" + expectedStep);
                    // 入力内容をモデルに保存
                    this.setInputValue();
                }

                // 現在のページ番号をdata属性に格納
                $("#letter-wizard", this.$el).attr("data-step", expectedStep);

                this.updateButtons();
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
            var query = StringUtil.parseQueryString(queryString);
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
            // this.moveTo()が再帰的に呼び出されてしまうのを防ぐ
            if (this._isMoving) {
                this._isMoving = false;
                return true;
            }

            // エラーチェックを行う。
            var isInvalid = false;
            // ただし、前に戻る場合はチェックは回避する。
            if ( newIndex > currentIndex ) {
                if (this.form.valid()) {
                    if (!this.file) {
                        vexDialog.defaultOptions.className = 'vex-theme-default vex-theme-letter';
                        vexDialog.buttons.YES.text = 'OK';
                        vexDialog.alert("画像が未選択です。");
                        isInvalid = true;
                    }
                    if (currentIndex === 2 && $("#letter-wizard-form__nickname").val().length > 20) {
                        vexDialog.defaultOptions.className = 'vex-theme-default vex-theme-letter';
                        vexDialog.buttons.YES.text = 'OK';
                        vexDialog.alert("お名前は20文字以内で入力してください。");
                        isInvalid = true;
                    }
                } else {
                    isInvalid = true;
                }
            }

            // チェック結果による動作切り分け
            if (isInvalid) {
                return false;
            } else {
                this._isMoving = true;
                this.setConfirmLabel();
                this.moveTo(newIndex + 1);
                return true;
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
            app.ga.trackEvent("写真投稿ページ", "「投稿する」ボタン押下");
            // ニックネームをlocalStorageに保存
            this.saveLocalStorage();
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
                            $(this.el).find("img").click($.proxy(this.onClickGallery, this));
                        }
                    }, this));
                    element.find("img").attr("src", file.url);
                    element.find("img").data("fileEntry", file);
                    $("#gallery-list").append(element);
                } else {
                    // 動画の場合は共通処理以外は何もしない
                    fileCount++;
                    if (fileCount >= fileArray.length) {
                        this.hideLoading();
                        $(this.el).find("img").unbind("click");
                        $(this.el).find("img").click($.proxy(this.onClickGallery, this));
                    }
                }
            }, this));
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
                    var imageDataURL = e.target.result;
                    var reader = new FileReader();
                    reader.onload = $.proxy(function(e) {
                        target.data = e.target.result;
                        app.ga.trackEvent("写真投稿ページ", "写真選択（「ギャラリー一覧」から）");
                        this.onLoadFileExtend(e, file, imageDataURL, target);
                    }, this);
                    reader.readAsArrayBuffer(file);
                }, this);
                reader.readAsDataURL(file);

            }, this), function(e) {
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
            this.model.set("site", "写真投稿");
            this.model.set("title", $("#letter-wizard-form__title").val());
            this.model.set("description", $("#letter-wizard-form__body").val());
            this.model.set("nickname", $("#letter-wizard-form__nickname").val());
            var imageUrl = this.generateFileName(this.file.name);
            this.model.set("imageUrl", imageUrl);
            this.model.set("imageThumbUrl", "thumbnail.png");
            this.model.set("createUserId", app.user.get("__id"));

            // 配信日は固定で翌日から1週間とする
            var prePublishedAt = BusinessUtil.getCurrentPublishDate();
            this.model.set("publishedAt", moment(prePublishedAt).add(1, "d").format("YYYY-MM-DD"));
            this.model.set("depublishedAt", moment(prePublishedAt).add(Code.LETTER_PUB_PERIOD, "d").format("YYYY-MM-DD"));
        },
        /**
         * 投稿画面で画像が選択された際に呼び出されるコールバック関数。
         * <p>
         * Google Analytics ログ記録処理を実装する。
         * </p>
         * @param event {Event} Clickイベント
         */
        fireAnalyticsLogOnChangeFileData: function(event) {
            app.ga.trackEvent("写真投稿ページ", "写真選択（「他の写真を選ぶ」から）");
        },
        /**
         * ファイル読み込み後に行う拡張処理
         * @memberOf LetterWizardView#
         * @param {Event} ev ファイルロードイベント
         * @param {Object} file ファイルオブジェクト
         * @param {Object} imageDataURL 画像のData URL
         * @param {Object} target 選択した画像要素
         */
        onLoadFileExtend : function(ev, file, imageDataURL, target) {
            this.hideLoading();
            this.file = file;
            this.file.data = ev.target.result;
            this.file.dataURL = imageDataURL;
            if (navigator.userAgent.indexOf('Android') < 0) {
                this.makeThmbnail(this.file.data, $.proxy(function(blob) {
                    this.file.thumb = blob;
                }, this));
                $(".letterPicture").attr("src", $("#previewFile").attr("src"));
                return;
            }

            vexDialog.defaultOptions.className = 'vex-theme-default vex-theme-letter';
            vexDialog.buttons.YES.text = 'OK';
            vexDialog.buttons.NO.text = '選びなおす';
            vexDialog.open({
                message : 'この写真でいいですか？',
                input : "<div class='vex-custom-input-wrapper'><img src='" + $(target).attr("src") +
                        "' style='max-height: 400px; width: auto;'></div>",
                callback : $.proxy(function(value) {
                    var checkElem = $(".checkedPic");
                    checkElem.css("border", "none");
                    checkElem.removeClass("checkedPic");
                    if (value) {
                        this.makeThmbnail(this.file.data, $.proxy(function(blob) {
                            this.file.thumb = blob;
                        }, this));
                        $(".letterPicture").attr("src", $(target).attr("src"));
                        //$(target).css("border", "3px solid red");
                        $(target).addClass("checkedPic");
                        this.$step.steps("next");
                    } else {
                        this.file = null;
                    }
                    $(".vex-custom-input-wrapper").remove();
                    return;
                }, this)
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
            if (!this.model.get("__id")) {
                this.model.id = AbstractModel.createNewId();
            }
            if (!this.model.get("imagePath")) {
                this.model.set("imagePath", this.generateFilePath());
            }

            // コールバックの定義
            var count = 2;
            var success = $.proxy(function(e) {
                if (--count <= 0) {
                    this.saveModel();
                }
            }, this);
            var error = $.proxy(function(model, resp, options) {
                this.hideLoading();
                this.showErrorMessage("写真情報の保存", resp);
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
            thmbDavModel.set("fileName", "thumbnail.png");
            thmbDavModel.set("data", this.file.thumb);
            thmbDavModel.set("contentType", this.file.type);
            thmbDavModel.save(null, {
                success : success,
                error : error
            });
        },
        /**
         * localStorageからデータ読み込み、画面に設定
         * @memberOf LetterWizardView#
         */
        setLocalStorageValue : function() {
            // nicknameの読み込み
            this.nicknameArray = JSON.parse(localStorage.getItem("nickname"));
            if (this.nicknameArray) {
                var dropdownList = $(".dropdownList");
                // ニックネーム候補用リスト作成
                _.each(this.nicknameArray, function(nickname) {
                    dropdownList.append("<li>" + nickname + "</li>");
                });
                var nicknameInput = $("#letter-wizard-form__nickname");
                nicknameInput.focus(function () {
                    dropdownList.slideDown();
                });

                dropdownList.find("li").each(function () {
                    $(this).click(function () {
                        nicknameInput.val($(this).text());
                    }); 
                });
            }
        },
        /**
         * localStorageにデータを保存する
         * @memberOf LetterWizardView#
         */
        saveLocalStorage : function() {
            // nicknameの保存
            var nicknameArray = [];
            if (this.nicknameArray) {
                nicknameArray = this.nicknameArray;
            }
            nicknameArray.unshift(this.model.get("nickname"));
            nicknameArray = _.uniq(nicknameArray);
            if (nicknameArray.length > 4) {
                nicknameArray.pop();
            }
            localStorage.setItem("nickname",JSON.stringify(nicknameArray));
        },
        /**
         * Modelの保存
         * @memberOf LetterWizardView#
         */
        saveModel : function() {
            this.model.save(null, {
                success : $.proxy(function() {
                    $("#gallery-list").empty();
                    this.hideLoading();
                    app.router.go('letters/posted');
                }, this),
                error : $.proxy(function(model, resp, options) {
                    this.hideLoading();
                    this.showErrorMessage("写真情報の保存", resp);
                }, this)
            });
        },

        /**
         * ボタン表示の更新
         * @memberOf LetterWizardView#
         */
        updateButtons : function() {
            var currentStep = this.$step.steps("getCurrentIndex") + 1;

            // 先頭のステップかつAndroidの場合、「OK」ボタンを非表示にする
            if (currentStep === 1 && this.isAndroid) {
                $("[href='#next']").hide();
            } else {
                $("[href='#next']").show();
            }
            // 先頭のステップのみグローバルナビの「戻る」ボタンを表示
            if (currentStep === 1) {
                $("#main").addClass("is-subpage");
            } else {
                $("#main").removeClass("is-subpage");
            }
        },

        /**
         * ビューが破棄される時に呼ばれる
         * @memberOf LetterWizardView#
         */
        cleanup : function() {
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
