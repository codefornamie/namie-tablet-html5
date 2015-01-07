define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var Code = require("modules/util/Code");

    /**
     * 記事一覧アイテム(メニュー用)のViewを作成する。
     * 
     * @class 記事一覧アイテム(メニュー用)のView
     * @exports FeedListItemView
     * @constructor
     */
    var FeedListItemView = AbstractView.extend({
        /**
         * このViewのテンプレートファイパス
         * @memberOf EventListItemView#
         */
        template : require("ldsh!templates/{mode}/news/feedListItem"),

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         * @memberOf EventListItemView#
         */
        afterRendered : function() {
            var self = this;
            var articleImageElement = this.$el.find(".articleImage");
            var imageType = this.model.getImageType();

            var imageUrl = this.model.get("imageUrl");
            if (this.model.get("imageThumbUrl")) {
                imageUrl = this.model.get("imageThumbUrl");
            }
            switch (imageType) {
            case Code.IMAGE_TYPE_PIO:
                this.showPIOImages(".articleImage", [
                    {
                        imageUrl : imageUrl,
                        imageIndex : 1
                    }
                ]);

                break;

            case Code.IMAGE_TYPE_URL:
                articleImageElement.attr("src", imageUrl);
                break;

            case Code.IMAGE_TYPE_NONE:
                break;

            default:
                break;
            }
        }
    });

    module.exports = FeedListItemView;
});
