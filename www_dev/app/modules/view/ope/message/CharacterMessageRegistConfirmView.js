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