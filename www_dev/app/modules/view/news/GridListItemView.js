define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var FeedListItemView = require("modules/view/news/FeedListItemView");
    var Code = require("modules/util/Code");
    var Super = FeedListItemView;

    /**
     * 記事一覧アイテム(メニュー用)のViewを作成する。
     * 
     * @class 記事一覧アイテム(メニュー用)のView
     * @exports GridListItemView
     * @constructor
     */
    var GridListItemView = FeedListItemView.extend({
        /**
         * このViewのテンプレートファイパス
         */
        template : require("ldsh!templates/news/news/gridListItem"),

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         * @memberof GridListItemView#
         */
        afterRendered : function() {
            var self = this;
            var imageType = this.model.getImageType();

            // 画像URLがない場合は、画像のエリアをつめる
            // 画像URLがある場合は、画像読み込みに失敗したら画像のエリアをつめる
            if (imageType === Code.IMAGE_TYPE_NONE) {
                this.$el.find(".grid-list__item").addClass("is-no-image");
            } else {
                this.$el.find(".articleImage").on("error", function() {
                    self.$el.find(".grid-list__item").addClass("is-no-image");
                });
            }

            Super.prototype.afterRendered.call(this);
        }
    });

    module.exports = GridListItemView;
});
