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

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * キャラクターメッセージ登録確認画面のViewクラス
     * 
     * @class キャラクターメッセージ登録確認画面のViewクラス
     * @exports CharacterMessageRegistConfirmView
     * @constructor
     */
    var CharacterMessageRegistConfirmView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         */
        template : require("ldsh!templates/ope/message/characterMessageRegistConfirm"),

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf CharacterMessageRegistConfirmView#
         */
        afterRendered : function() {

        },

        events : {
            "click #characterMessageBackButton" : "onClickCharacterMessageBackButton",
            "click #characterMessageRegistButton" : "onClickCharacterMessageRegistButton"
        },

        /**
         * 戻るボタンを押下された際に呼び出されるコールバック関数。
         * @memberOf CharacterMessageRegistConfirmView#
         */
        onClickCharacterMessageBackButton : function() {
            this.$el.remove();
            $("#characterMessageRegistPage").show();
            $("#snap-content").scrollTop(0);
            $("#contents__primary").scrollTop(0);
        },

        /**
         * 登録するボタンが押下された際に呼び出されるコールバック関数。
         * @memberOf CharacterMessageRegistConfirmView#
         */
        onClickCharacterMessageRegistButton : function() {
            this.saveModel();
        },
        /**
         * キャラクターメッセージ情報の保存処理を行う。
         * <p>
         * 保存処理完了後、メッセージ一覧画面へ遷移する。
         * </p>
         * @memberOf CharacterMessageRegistConfirmView#
         */
        saveModel : function() {
            this.showLoading();
            this.model.save(null, {
                success : $.proxy(function(model, resp, options) {
                    this.hideLoading();
                    this.showSuccessMessage("キャラクターメッセージの保存", model);
                    app.router.opeMessage();
                }, this),
                error : $.proxy(function(model, resp, options) {
                    this.hideLoading();
                    this.showErrorMessage("キャラクターメッセージの保存", resp);
                    app.router.opeMessage();
                }, this)
            });
        }
    });
    module.exports = CharacterMessageRegistConfirmView;
});
