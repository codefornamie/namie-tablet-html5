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
         * アラートダイアログのカスタムスタイル
         */
        dialogCustomClass : "vex-theme-letter",
        /**
         * @memberOf LetterEditView#
         */
        template : require("ldsh!templates/{mode}/edit/letterEdit"),

        /**
         * Layoutがレンダリングされたら呼ばれる
         * @memberOf LetterEditView#
         */
        afterRendered : function() {
            if (this.model.get("imageThumbUrl")) {
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
                    }, this),
                    error : $.proxy(function() {
                        app.logger.error("画像の取得に失敗しました");
                    }, this)
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
            if ($("#letter-edit-form").validate().form()) {
                if (this.validate()) {
                    this.showLoading();
                    this.setInputValue();
                    // データ更新後、etagを更新するためthis.modelを再度fetchする
                    async.series([
                            this.saveModel.bind(this), this.fetchModel.bind(this)
                    ], this.onSaveComplete.bind(this));
                } else {
                    return;
                }
            }
        },

        /**
         * バリデーションチェック
         * @memberOf LetterEditView#
         * @return {Boolean} エラーの場合はfalse
         */
        validate : function() {
            vexDialog.defaultOptions.className = 'vex-theme-default vex-theme-letter';
            vexDialog.buttons.YES.text = 'OK';
            // 本文文字列制限チェック
            if ($("#letter-edit-form__body").val().length > 140) {
                vexDialog.alert("ひとことは140文字以内で入力してください。");
                return false;
            }
            // お名前文字列制限チェック
            if ($("#letter-edit-form__nickname").val().length > 20) {
                vexDialog.alert("お名前は20文字以内で入力してください。");
                return false;
            }
            return true;
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
         * @param {Function} next
         */
        saveModel : function(next) {
            this.model.save(null, {
                success : function() {
                    next(null);
                },
                error : function(model, resp, options) {
                    next(resp);
                }
            });
        },
        /**
         * Modelのfetch処理
         * @memberOf LetterWizardView#
         * @param {Function} next
         */
        fetchModel : function(next) {
            this.model.fetch({
                success : function() {
                    next(null);
                },
                error : function(model, resp, options) {
                    next(resp);
                }
            });
        },
        /**
         * データの編集保存処理が完了した際に呼ばれるコールバック関数
         * @memberOf LetterWizardView#
         * @param {Object} err
         */
        onSaveComplete : function(resp) {
            this.hideLoading();
            if (resp) {
                this.showErrorMessage("写真情報の編集", resp);
                return;
            }
            app.router.go("letters/" + this.model.get("__id") + "/modified");
        },

    });

    module.exports = LetterEditView;
});