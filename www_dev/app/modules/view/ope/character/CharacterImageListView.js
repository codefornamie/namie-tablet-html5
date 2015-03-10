define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var Code = require("modules/util/Code");
    var AbstractView = require("modules/view/AbstractView");
    var CharacterImageListItemView = require("modules/view/ope/character/CharacterImageListItemView");
    var CharacterImageModel = require("modules/model/character/CharacterImageModel");

    /**
     * キャラクター画像選択画面のViewクラス
     * 
     * @class キャラクター画像選択画面のViewクラス
     * @exports AbstractView
     * @constructor
     */
    var CharacterImageListView = AbstractView.extend({
        template : require("ldsh!templates/ope/character/characterImageList"),
        characterImageModel : new CharacterImageModel(),
        /**
         * ViewのテンプレートHTMLの描画処理が完了前に呼び出される。
         * @memberOf CharacterImageListView#
         */
        beforeRendered : function() {
            var self = this;
            this.characterImageModel.set("__id", "WIDGET_CHARACTER_PATTERN");
            this.characterImageModel.fetch({
                success : function(model) {
                    app.logger.debug("Search successful");
                    app.serverConfig.WIDGET_CHARACTER_PATTERN = model.get("value");
                    self.showWidgetImageList();
                },
                error : function (model, resp, options) {
                    self.showErrorMessage("キャラクターウィジェット画像情報取得", resp);
                },
                reset : true
            });
        },
        /**
         * ウィジェット選択画像を表示する。
         * @memberOf CharacterImageListView#
         */
        showWidgetImageList : function() {
            var self = this;
            _.each(Code.WIDGET_CHARACTER, function(widget) {
                self.insertView("#characterImageCollectionList", new CharacterImageListItemView({
                    character : widget,
                    model : self.characterImageModel
                })).render();
            });
        },
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf CharacterImageListView#
         */
        afterRendered : function() {
            this.hideLoading();
        },

        /**
         * 初期化処理
         * @memberOf CharacterImageListView#
         */
        initialize : function() {
        },
    });
    module.exports = CharacterImageListView;
});
