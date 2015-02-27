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
                error : function () {
                    this.showMessage("ウィジェット使用画像情報取得に失敗しました。");
                },
                reset : true
            });
        },
        /**
         * ウィジェット選択画像を表示する。
         * @memberOf CharacterImageListView#
         */
        showWidgetImageList : function() {
            for (var i = 0; i <= Code.WIDGET_CHARACTER_NUM; i++) {
                var widget = Code.WIDGET_CHARACTER[i];
                this.insertView("#characterImageCollectionList", new CharacterImageListItemView({
                    character : widget,
                    model : this.characterImageModel
                })).render();
            }
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
