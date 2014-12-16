define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var TabletArticleListItemView = require("modules/view/news/ArticleListItemView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");

    /**
     * 記事一覧アイテムのViewを作成する。
     * 
     * @class 記事一覧アイテムのView
     * @exports LetterListItemView
     * @constructor
     */
    var LetterListItemView = TabletArticleListItemView.extend({
        template : require("ldsh!templates/{mode}/letter/top/letterListItem"),

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         * @memberof LetterListItemView#
         */
        afterRendered : function() {
            app.box.col("dav").getBinary(this.model.get("imageUrl"), {
                success : $.proxy(function(binary) {
                    app.logger.debug("getBinary()");
                    var arrayBufferView = new Uint8Array(binary);
                    var blob = new Blob([
                        arrayBufferView
                    ], {
                        type : "image/jpg"
                    });
                    var url = FileAPIUtil.createObjectURL(blob);
                    var imgElement = this.$el.find(".letterListItemPicture");
                    imgElement.load(function() {
                    });
                    imgElement.attr("src", url);
                },this),
                error: $.proxy(function () {
                    app.logger.error("画像の取得に失敗しました");
                },this)
            });

        },

        /**
         * aタグがクリックされたら呼ばれる
         * @override
         * @memberof LetterListItemView#
         */
        onClickAnchorTag: function (e) {
            e.preventDefault();
        }
    });
    module.exports = LetterListItemView;
});
