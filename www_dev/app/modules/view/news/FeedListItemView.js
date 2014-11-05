define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");

    /**
     * 記事一覧アイテム(メニュー用)のViewクラス
     * 
     * @class
     */
    var FeedListItemView = AbstractView.extend({
        animation: 'fadeIn',
        template : require("ldsh!/app/templates/news/feedListItem"),
        serialize : function() {
            return {
                model : this.model
            };
        },
        beforeRendered : function() {

        },

        afterRendered : function() {
            var self = this;

            if (this.model.get("imageUrl")) {
                $(this.el).find("#articleImage").attr("src",this.model.get("imageUrl"));
            } else if (this.model.get("fileName")) {
                // TODO 実機での画像表示処理の修正が終わったら以下も修正
//                app.box.col("dav").getBinary(this.model.get("fileName"), {
//                    success : function(binary) {
//                        var arrayBufferView = new Uint8Array(binary);
//                        var blob = new Blob([ arrayBufferView ], {
//                            type : "image/jpg"
//                        });
//                        var url = FileAPIUtil.createObjectURL(blob);
//                        var imgElement = $(self.el).find("#articleImage");
//                        imgElement.load(function() {
//                            window.URL.revokeObjectURL(imgElement.attr("src"));
//                        });
//                        imgElement.attr("src", url);
//                    }
//                });
                $(this.el).find("#articleImage").parent().hide();
            } else {
                $(this.el).find("#articleImage").parent().hide();
            }
        },
        /**
         * 初期化処理
         */
        initialize : function() {

        }

    });

    module.exports = FeedListItemView;
});
