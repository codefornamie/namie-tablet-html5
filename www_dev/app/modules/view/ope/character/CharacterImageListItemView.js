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
    var CharacterImageModel = require("modules/model/character/CharacterImageModel");

    /**
     * キャラクター選択画像アイテムのViewクラス
     * @class キャラクター選択画像アイテムのViewクラス
     * @exports AbstractView
     * @constructor
     */
    var CharacterImageListItemView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberOf CharacterImageListItemView#
         */
        template : require("ldsh!templates/ope/character/characterImageListItem"),
        /**
         * このViewの親要素
         * @memberOf CharacterImageListItemView#
         */
        tagName : "tr",
        /**
         * このViewのイベント
         * @memberOf CharacterImageListItemView#
         */
        events : {
            "change [data-character-image-enable-check]" : "onClickCharacterImageEnableCheck"
        },
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * キャラクターメッセージの表示の有無の設定値をcheckboxの選択状態に反映する。
         * </p>
         * @memberOf CharacterImageListItemView#
         */
        afterRendered : function() {
            // 現在使用されているウィジェットのライジオボタンをチェックする
            if (this.character[0].indexOf(app.serverConfig.WIDGET_CHARACTER_PATTERN) != -1) {
                this.$el.find("input[type='radio']").attr("checked", "checked");
            }

            // 画像表示処理
            var characterPath = app.root + "app/img/chara/";
            var character1 = characterPath + this.character[0];
            var character2 = characterPath + this.character[1];
            this.$(".character__image--1").css("background-image", "url(" + character1 + ")").show();
            this.$(".character__image--2").css("background-image", "url(" + character2 + ")").hide();

            // ウィジェット画像に動きを入れるため、画像を0.5秒毎に差し替える。
            setInterval(function(character1, character2) {
                this.$(".character__image--1").toggle();
                this.$(".character__image--2").toggle();
            }.bind(this), 500);
        },
        /**
         * ウィジェット画像切り替えのラジオボタンが押下された際のコールバック関数
         * @memberOf CharacterImageListItemView#
         */
        onClickCharacterImageEnableCheck : function() {
            this.showLoading();

            // ファイル名から登録する値を取得する
            var value = this.character[0].substring(0, this.character[0].lastIndexOf("_"));

            this.model.set("__id", "WIDGET_CHARACTER_PATTERN");
            this.model.set("value", value);
            this.model.set("label", "ウィジェット画像");
            this.model.set("etag","*");
            // configulatio(WIDGET_CHARACTER_PATTERN)の更新
            this.model.save(null, {
                success : $.proxy(function(model) {
                    this.hideLoading();
                    this.showSuccessMessage("ウィジェット画像切り替え", model);
                    app.router.go("ope-character");
                }, this),
                error : $.proxy(function(resp, options) {
                    if (resp.event && resp.event.isConflict()) {
                        this.showErrorMessage("ウィジェット画像切り替え", resp.event);
                    } else {
                        this.showErrorMessage("ウィジェット画像切り替え", resp.event, app.PIOLogLevel.ERROR);
                    }
                    this.hideLoading();
                }, this)
            });
        },
    });
    module.exports = CharacterImageListItemView;
});
