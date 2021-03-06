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
    var AbstractView = require("modules/view/AbstractView");
    var vexDialog = require("vexDialog");
    /**
     * スライドショー画面一覧アイテムのViewクラス
     * @class スライドショー画面一覧アイテムのViewクラス
     * @exports OpeSlideshowListItemView
     * @constructor
     */
    var CharacterMessageListItemView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         */
        template : require("ldsh!templates/ope/message/characterMessageListItem"),
        /**
         * このViewの親要素
         * @memberOf CharacterMessageListItemView#
         */
        tagName : "tr",
        /**
         * このViewのイベント
         * @memberOf CharacterMessageListItemView#
         */
        events : {
            "click [data-character-message-edit-button]" : "onClickCharacterMessageEditButton",
            "click [data-character-message-delete-button]" : "onClickCharacterMessageDeleteButton",
            "change [data-character-message-enable-check]" : "onClickCharacterMessageEnableCheck"
        },
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * キャラクターメッセージの表示の有無の設定値をcheckboxの選択状態に反映する。
         * </p>
         * @memberOf CharacterMessageListView#
         */
        afterRendered : function() {
            this.$("[data-character-message-enable-check]").prop("checked", this.model.get("enabled"));
        },
        /**
         * メッセージ編集ボタンが押下された際に呼び出されるコールバック関数
         * @param {Event} event Clickイベント
         * @memberOf CharacterMessageListItemView#
         */
        onClickCharacterMessageEditButton : function(event) {
            app.router.opeMessageEdit({
                model : this.model
            });
        },
        /**
         * メッセージ表示の有無のチェックボックスの選択状態が変化した際に呼び出されるコールバック関数
         * @param {Event} event Clickイベント
         * @memberOf CharacterMessageListItemView#
         */
        onClickCharacterMessageEnableCheck : function(event) {
            var checked = $(event.currentTarget).prop("checked");
            this.showLoading();

            this.model.set("enabled", checked);
            this.model.save(null, {
                success : $.proxy(function(model, resp, options) {
                    this.hideLoading();
                    this.showSuccessMessage("キャラクターメッセージの表示有無の更新", model);
                    app.router.opeMessage();
                }, this),
                error : $.proxy(function(model, resp, options) {
                    this.hideLoading();
                    this.showErrorMessage("キャラクターメッセージの表示有無の更新", resp);
                    app.router.opeMessage();
                }, this)
            });
        },
        /**
         * メッセージ削除ボタンが押下された際に呼び出されるコールバック関数
         * @param {Event} event Clickイベント
         * @memberOf CharacterMessageListItemView#
         */
        onClickCharacterMessageDeleteButton : function(event) {
            vexDialog.defaultOptions.className = 'vex-theme-default';
            vexDialog.buttons.YES.text = 'はい';
            vexDialog.buttons.NO.text = 'いいえ';
            vexDialog.open({
                message : 'このメッセージを削除していいですか？',
                callback : $.proxy(function(value) {
                    if (value) {
                        this.showLoading();

                        this.model.set("isDelete", true);
                        this.model.save(null, {
                            success : $.proxy(function(model, resp, options) {
                                this.hideLoading();
                                this.showSuccessMessage("キャラクターメッセージ情報の削除", model);
                                app.router.opeMessage();
                            }, this),
                            error : $.proxy(function(model, resp, options) {
                                this.hideLoading();
                                this.showErrorMessage("キャラクターメッセージ情報の削除", resp);
                                app.router.opeMessage();
                            }, this)
                        });
                    }
                    return;
                }, this)
            });
        }
    });
    module.exports = CharacterMessageListItemView;
});
