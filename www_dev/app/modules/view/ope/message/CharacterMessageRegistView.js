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
    var ArticleRegistView = require("modules/view/posting/news/ArticleRegistView");
    var CharacterMessageRegistConfirmView = require("modules/view/ope/message/CharacterMessageRegistConfirmView");
    var CharacterMessageModel = require("modules/model/message/CharacterMessageModel");
    var vexDialog = require("vexDialog");

    /**
     * キャラクターメッセージ新規登録・編集画面のViewクラス
     * 
     * @class キャラクターメッセージ新規登録・編集画面のViewクラス
     * @exports ChracterMessageRegistView
     * @constructor
     */
    var ChracterMessageRegistView = ArticleRegistView.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberOf ChracterMessageRegistView#
         */
        template : require("ldsh!templates/ope/message/characterMessageRegist"),
        /**
         * フォーム要素のID
         * @memberOf ChracterMessageRegistView#
         */
        formId : '#characterMessageRegistForm',
        /**
         * このViewのイベント定義
         * @memberOf ChracterMessageRegistView#
         */
        events : {
            "click #characterMessageCancelButton" : "onClickCharacterMessageCancelButton",
            "click #characterMessageConfirmButton" : "onClickCharacterMessageConfirmButton"
        },
        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf ChracterMessageRegistView#
         */
        afterRendered : function() {
            this.setData();
        },
        /**
         * 入力項目に値をセットする。
         * @memberOf ChracterMessageRegistView#
         */
        setData: function () {
            if (!this.model) {
                // 新規
                return;
            } else {
                // 編集
                this.$("#characterMessageRegistTitle").text("メッセージ更新");
                this.$("#characterMessageContents").val(this.model.get("message"));
            }
            
            
        },
        /**
         * 確認画面押下時のコールバック関数
         * @memberOf ChracterMessageRegistView#
         */
        onClickCharacterMessageConfirmButton : function() {
            if ($(this.formId).validate().form()) {
                var errmsg = this.validate();
                if (errmsg) {
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert(errmsg);
                } else {
                    this.onSubmit();
                }
            }
        },
        /**
         * キャンセルボタン押下時のコールバック関数
         * @memberOf ChracterMessageRegistView#
         */
        onClickCharacterMessageCancelButton : function() {
            if (this.backFunction) {
                this.backFunction();
            } else {
                app.router.back();
            }
        },
        /**
         * バリデーションチェックがOKとなり、登録処理が開始された際に呼び出されるコールバック関数。
         * @memberOf ChracterMessageRegistView#
         */
        onSubmit : function() {
            // 登録処理を開始する
            this.setInputValue();
            $("#characterMessageRegistPage").hide();
            this.setView("#characterMessageRegistConfirmWrapperPage", new CharacterMessageRegistConfirmView({
                model : this.model,
            })).render();
            $("#snap-content").scrollTop(0);
        },
        /**
         * バリデーションチェック
         * @memberOf ChracterMessageRegistView#
         * @return {String} エラーメッセージ。正常の場合はnullを返す
         */
        validate : function() {
            return null;
        },
        /**
         * モデルにデータをセットする関数
         * @memberOf ChracterMessageRegistView#
         */
        setInputValue : function() {
            if (this.model === null) {
                this.model = new CharacterMessageModel();
            }
            this.model.set("message", this.$("#characterMessageContents").val());
            this.model.set("type", 1);
            this.model.set("weight", 0);
            this.model.set("enabled", true);
        }

    });
    module.exports = ChracterMessageRegistView;
});
