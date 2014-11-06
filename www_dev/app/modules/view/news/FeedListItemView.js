define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");

    /**
     * 記事一覧アイテム(メニュー用)のViewを作成する。
     * 
     * @class 記事一覧アイテム(メニュー用)のView
     * @exports FeedListItemView
     * @constructor
     */
    var FeedListItemView = AbstractView.extend({
        /**
         * このViewを表示する際に利用するアニメーション
         */
        animation : 'fadeIn',
        /**
         * このViewのテンプレートファイパス
         */
        template : require("ldsh!/app/templates/news/feedListItem"),

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            var self = this;
            var articleImageElement = this.$el.find(".articleImage");

            if (this.model.get("imageUrl")) {
                articleImageElement.attr("src", this.model.get("imageUrl"));
            } else if (this.model.get("fileName")) {
                // TODO サムネイル画像取得処理に変更するべき
                app.box.col("dav").getBinary(this.model.get("fileName"), {
                    success : function(binary) {
                        var arrayBufferView = new Uint8Array(binary);
                        var blob = new Blob([ arrayBufferView ], {
                            type : "image/jpg"
                        });
                        var url = FileAPIUtil.createObjectURL(blob);
                        articleImageElement.load(function() {
                            articleImageElement.parent().show();
                            window.URL.revokeObjectURL(articleImageElement.attr("src"));
                        });
                        articleImageElement.attr("src", url);
                    }
                });
                articleImageElement.parent().hide();
            } else {
                articleImageElement.parent().hide();
            }
        }
    });

    module.exports = FeedListItemView;
});
