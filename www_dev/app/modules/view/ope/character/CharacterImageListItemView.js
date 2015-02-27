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
            var characterPath = "../../app/img/chara/";
            var character1 = characterPath + this.character[0];
            var character2 = characterPath + this.character[1];
            this.$(".character__image--1").css("background-image", "url(" + character1 + ")");
            this.$(".character__image--2").css("background-image", "url(" + character2 + ")").parent().hide();

            // ウィジェット画像に動きを入れるため、画像を0.5秒毎に差し替える。
            setInterval(function(character1, character2) {
                    this.$(".character__image--1").parent().toggle();
                    this.$(".character__image--2").parent().toggle();
            }.bind(this), 500);
        },
        /**
         * ウィジェット画像切り替えのラジオボタンが押下された際のコールバック関数
         * @memberOf CharacterImageListItemView#
         */
        onClickCharacterImageEnableCheck : function() {
            this.showLoading();

            // ファイル名から登録する値を取得する
            var value = this.character[0].substring(0, this.character[0].indexOf(".png"));

            this.model.set("__id", "WIDGET_CHARACTER_PATTERN");
            this.model.set("value", value);
            this.model.set("label", "ウィジェット画像");
            this.model.set("etag","*");
            // configulatio(WIDGET_CHARACTER_PATTERN)の更新
            this.model.save(null, {
                success : $.proxy(function() {
                    this.hideLoading();
                    app.router.go("ope-character");
                }, this),
                error : $.proxy(function(resp, options) {
                    if (resp.event && resp.event.isConflict()) {
                        this.showMessage("他のユーザーとウィジェット画像の切り替え操作が競合したため、保存できませんでした。<br/>再度、保存操作を行ってください。", resp.event);
                    } else {
                        this.showMessage("ウィジェット画像切り替えに失敗しました", resp.event, app.PIOLogLevel.ERROR);
                    }
                    this.hideLoading();
                }, this)
            });
        },
    });
    module.exports = CharacterImageListItemView;
});
