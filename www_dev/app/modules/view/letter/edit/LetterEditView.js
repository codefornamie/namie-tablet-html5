define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var WebDavModel = require("modules/model/WebDavModel");
    var AbstractView = require("modules/view/AbstractView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var vexDialog = require("vexDialog");
    var async = require("async");

    /**
     * 記事編集画面のViewクラス
     * 
     * @class 記事編集画面のViewクラス
     * @exports LetterEditView
     * @constructor
     */
    var LetterEditView = AbstractView.extend({
        /**
         * @memberOf LetterEditView#
         */
        template : require("ldsh!templates/{mode}/edit/letterEdit"),

        /**
         * Layoutがレンダリングされたら呼ばれる
         * @memberOf LetterEditView#
         */
        afterRendered : function() {
            if(this.model.get("imageThumbUrl")){
                var davModel = new WebDavModel();
                var path = this.model.get("imagePath");
                path = path ? path + "/" : "";
                davModel.id = path + this.model.get("imageThumbUrl");
                davModel.fetch({
                    success : $.proxy(function(model, binary) {
                        app.logger.debug("getBinary()");
                        var arrayBufferView = new Uint8Array(binary);
                        var blob = new Blob([
                            arrayBufferView
                        ], {
                            type : "image/jpg"
                        });

                        var url = FileAPIUtil.createObjectURL(blob);
                        var imgElement = this.$el.find(".letterPicture");
                        imgElement.load(function() {
                        });
                        imgElement.attr("src", url);
                    },this),
                    error: $.proxy(function () {
                        app.logger.error("画像の取得に失敗しました");
                    },this)
                });
            }
        },

        /**
         * イベント一覧
         * @memberOf LetterEditView#
         */
        events : {
            "click [data-update-letter]" : "onClickUpdateLetter"
        },

        /**
         * 初期化する
         * @memberOf LetterEditView#
         * @param {Object} param
         */
        initialize : function(param) {
            console.assert(param, "param should be specified");
            console.assert(param.letterModel, "param.letterModel should be specified");

            this.model = param.letterModel;
        },

        /**
         * 更新するボタンが押された後に呼ばれる
         * @param {Event} ev
         * @memberOf LetterEditView#
         */
        onClickUpdateLetter : function(ev) {
            this.showLoading();
            this.validate();
            this.setInputValue();
            // データ更新後、etagを更新するためthis.modelを再度fetchする
            async.series([
                          this.saveModel.bind(this), this.fetchModel.bind(this)
                  ], this.onSaveComplete.bind(this));
        },
        
        /**
         * バリデーションチェック
         * @memberOf LetterEditView#
         */
        validate : function() {
            if ($("#lletter-edit-form__body").val().length > 140) {
                vexDialog.defaultOptions.className = 'vex-theme-default vex-theme-letter';
                vexDialog.buttons.YES.text = 'OK';
                vexDialog.alert("ひとことは140文字以内で入力してください。");
                return;
            }
            if ($("#letter-edit-form__nickname").val().length > 20) {
                vexDialog.defaultOptions.className = 'vex-theme-default vex-theme-letter';
                vexDialog.buttons.YES.text = 'OK';
                vexDialog.alert("お名前は20文字以内で入力してください。");
                return;
            }
        },
        /**
         * モデルにデータをセットする関数
         * @memberOf LetterEditView#
         */
        setInputValue : function() {
            this.model.set("description", $("#letter-edit-form__body").val());
            this.model.set("nickname", $("#letter-edit-form__nickname").val());
        },
        
        /**
         * Modelの保存
         * @memberOf LetterWizardView#
         */
        saveModel : function(next) {
            this.model.save(null, {
                success : function() {
                    next("aa");
                },
                error : function(e) {
                    next(e);
                }
            });
        },
        /**
         * Modelのfetch処理
         * @memberOf LetterWizardView#
         */
        fetchModel : function(next) {
            this.model.fetch({
                success : function() {
                    next(null);
                },
                error : function(e) {
                    next(e);
                }
            });
        },
        /**
         * データの編集保存処理が完了した際に呼ばれるコールバック関数
         * @memberOf LetterWizardView#
         */
        onSaveComplete : function(err) {
            if (err) {
                this.hideLoading();
                vexDialog.alert("保存に失敗しました。");
                app.logger.error("保存に失敗しました。");
                return;
            }
            this.hideLoading();
            app.router.go("letters/" + this.model.get("__id") + "/modified");
        },

    });

    module.exports = LetterEditView;
});