define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var AbstractView = require("modules/view/AbstractView");
    var CharacterMessageListItemView = require("modules/view/ope/message/CharacterMessageListItemView");
    var CharacterMessageCollection = require("modules/collection/message/CharacterMessageCollection");

    /**
     * キャラクターメッセージ一覧画面のViewクラス
     * 
     * @class スライドショー一覧画面のViewクラス
     * @exports OpeSlideshowListView
     * @constructor
     */
    var CharacterMessageListView = AbstractView.extend({
        template : require("ldsh!templates/ope/message/characterMessageList"),
        characterMessageCollection : null,
        events : {
            "click [data-character-message-register-button]" : "onClickCharacterMessageRegisterButton",
                "click [data-character-message-edit-button]" : "onClickCharacterMessageEditButton"
        },
        /**
         * ViewのテンプレートHTMLの描画処理が完了前に呼び出される。
         * @memberOf CharacterMessageListView#
         */
        beforeRendered : function() {
            this.characterMessageCollection.each(function (model) {
                this.insertView("#characterMessageCollectionList", new CharacterMessageListItemView({
                    model : model
                }));
            }.bind(this));
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf CharacterMessageListView#
         */
        afterRendered : function() {
            this.hideLoading();
        },

        /**
         * 初期化処理
         * @memberOf CharacterMessageListView#
         */
        initialize : function() {
            this.characterMessageCollection = new CharacterMessageCollection();
            this.listenTo(this.characterMessageCollection, "reset sync request destroy", this.render);
            this.characterMessageCollection.fetch({
                success : function(model, resp, options) {
                    this.showSuccessMessage("キャラクターメッセージの検索", model);
                }.bind(this),
                error : function onErrorLoadSlideshow(model, resp, options) {
                    this.showErrorMessage("キャラクターメッセージの検索", resp);
                }.bind(this),
                reset : true
            });
        },
        /**
         *  新規キャラクターメッセージ登録ボタン押下時に呼び出される
         *  @memberOf CharacterMessageListView#
         */
        onClickCharacterMessageRegisterButton: function () {
            app.router.opeMessageRegist();
        }
    });
    module.exports = CharacterMessageListView;
});
