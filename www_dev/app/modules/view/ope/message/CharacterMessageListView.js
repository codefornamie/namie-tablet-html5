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
        characterMessageCollection : new CharacterMessageCollection(),
        events : {
            
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
            this.listenTo(this.characterMessageCollection, "reset sync request destroy", this.render);
            this.characterMessageCollection.fetch({
                success : function() {
                    app.logger.debug("Search successful");
                },

                error : function onErrorLoadSlideshow() {
                    //this.showMessage("メッセージ情報取得に失敗しました。");
                }
            });
        }
    });
    module.exports = CharacterMessageListView;
});
