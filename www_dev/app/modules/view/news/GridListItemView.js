define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");

    /**
     * 記事一覧アイテム(メニュー用)のViewを作成する。
     * 
     * @class 記事一覧アイテム(メニュー用)のView
     * @exports GridListItemView
     * @constructor
     */
    var GridListItemView = AbstractView.extend({
        /**
         * このViewのテンプレートファイパス
         */
        template : require("ldsh!templates/{mode}/news/gridListItem"),

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            var self = this;
            var $articleImage = this.$el.find(".articleImage");

            if (this.model.get("imageUrl")) {
                $articleImage.attr("src", this.model.get("imageUrl"));
            } else if (this.model.get("fileName")) {
                // TODO サムネイル画像取得処理に変更するべき
                var onGetBinary = function(binary) {
                    var arrayBufferView = new Uint8Array(binary);
                    var blob = new Blob([
                        arrayBufferView
                    ], {
                        type : "image/jpg"
                    });
                    var url = FileAPIUtil.createObjectURL(blob);

                    $articleImage
                        .on("load", function() {
                            $(this).parent().show();
                            window.URL.revokeObjectURL($(this).attr("src"));
                        })
                        .attr("src", url);
                };

                try {
                    app.box
                        .col("dav")
                        .getBinary(this.model.get("fileName"), {
                            success : onGetBinary
                        });
                } catch (e) {
                    console.error(e);
                }

                $articleImage.parent().hide();
            } else {
                $articleImage.parent().hide();
            }
        }
    });

    module.exports = GridListItemView;
});
