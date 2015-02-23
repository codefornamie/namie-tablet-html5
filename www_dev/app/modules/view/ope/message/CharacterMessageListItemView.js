define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

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
            "click [data-character-message-delete-button]" : "onClickCharacterMessageDeleteButton"
        },
        /**
         * メッセージ編集ボタンが押下された際に呼び出されるコールバック関数
         * @param {Event} event Clickイベント
         * @memberOf CharacterMessageListItemView#
         */
        onClickCharacterMessageEditButton : function(event) {
            
        },
        /**
         * メッセージ削除ボタンが押下された際に呼び出されるコールバック関数
         * @param {Event} event Clickイベント
         * @memberOf CharacterMessageListItemView#
         */
        onClickCharacterMessageDeleteButton : function(event) {
            
        }
    });
    module.exports = CharacterMessageListItemView;
});
