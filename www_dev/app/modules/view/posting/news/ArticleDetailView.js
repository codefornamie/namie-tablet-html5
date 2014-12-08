define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var DateUtil = require("modules/util/DateUtil");
    var CommonUtil = require("modules/util/CommonUtil");

    /**
     * 記事詳細画面のViewクラス
     * 
     * @class 記事詳細画面のViewクラス
     * @exports ArticleDetailView
     * @constructor
     */
    var ArticleDetailView = AbstractView.extend({
        /**
         *  テンプレートファイル
         */
        template : require("ldsh!templates/{mode}/news/articleDetail"),

        /**
         *  ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         */
        beforeRendered : function() {
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         */
        afterRendered : function() {
            $("#snap-content").scrollTop(0);

            this.showImage();
        },

        /**
         *  Viewを初期化する
         */
        initialize : function() {
            console.assert(this.model, 'model is not defined');
        },

        /**
         * このViewが表示している記事に関連する画像データの取得と表示を行う。
         */
        showImage: function () {
            var onGetBinary = $.proxy(function(binary,item) {
                var articleImage = $(this.el).find(".eventFileImage img");
                var arrayBufferView = new Uint8Array(binary);
                var blob = new Blob([ arrayBufferView ], {
                    type : "image/jpg"
                });
                var url = FileAPIUtil.createObjectURL(blob);
                $(articleImage[item.imageIndex-1]).load(function() {
//                    $(this).show();
                    window.URL.revokeObjectURL($(this).attr("src"));
                });
                $(articleImage[item.imageIndex-1]).attr("src", url);
                $(articleImage[item.imageIndex-1]).data("blob", blob);
            },this);

            var imgArray = [];
            for (var i=1;i<4;i++) {
                var index = i;
                if (i === 1) {
                    index = "";
                }
                if (this.model.get("imageUrl" + index)) {
                    imgArray.push({
                        imageUrl:this.model.get("imageUrl" + index),
                        imageComment:this.model.get("imageComment" + index),
                        imageIndex:i
                    });
                } else {
                    $($(this.el).find(".eventFileImage img")[i-1]).parent().parent().hide();
                }
            }
            _.each(imgArray,$.proxy(function (item) {
                try {
                    app.box.col("dav").getBinary(item.imageUrl, {
                        success : $.proxy(function(binary) {
                            onGetBinary(binary,item);
                        },this)
                    });
                } catch (e) {
                    console.error(e);
                }
            },this));
        },

        events : {
            'click [data-goto-edit]': 'onClickGotoEdit',
            'click [data-goto-cancel]': 'onClickGotoCancel',
            'click [data-goto-delete]': 'onClickGotoDelete'
        },

        /**
         *  編集ボタンをクリックしたら呼ばれる
         */
        onClickGotoEdit: function () {
            this.showLoading();
            app.router.articleRegist({
                model: this.model
            });
        },

        /**
         *  削除ボタンをクリックしたら呼ばれる
         */
        onClickGotoDelete: function () {
        },
        /**
         *  キャンセルボタンをクリックしたら呼ばれる
         */
        onClickGotoCancel: function () {
        }
    });
    module.exports = ArticleDetailView;
});
