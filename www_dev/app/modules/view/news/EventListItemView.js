define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var ArticleListItemView = require("modules/view/news/ArticleListItemView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var DateUtil = require("modules/util/DateUtil");
    var CommonUtil = require("modules/util/CommonUtil");

    /**
     * 記事一覧アイテムのViewを作成する。
     *
     * @class 記事一覧アイテムのView
     * @exports EventListItemView
     * @constructor
     */
    var EventListItemView = ArticleListItemView.extend({
        /**
         * このViewを表示する際に利用するアニメーション
         */
        template : require("ldsh!templates/{mode}/news/eventsDetail"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            this.showImage();
            this.afterRenderCommon();
            var dateString = DateUtil.formatDate(new Date(this.model.get("startDate")),"yyyy年MM月dd日(ddd)");
            if(this.model.get("endDate")){
                dateString += " ～ " + DateUtil.formatDate(new Date(this.model.get("endDate")),"yyyy年MM月dd日(ddd)");
            }
            var st = this.model.get("startTime");
            st = st ? st : "";
            var et = this.model.get("endTime");
            et = et ? et : "";
            if(st || et){
                dateString += "\n" + st + " ～ " + et;
            }
            $(this.el).find("#articleDateTime").html(CommonUtil.sanitizing(dateString));

        },
        /**
         * このViewが表示している記事に関連する画像データの取得と表示を行う。
         */
        showImage : function() {
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
    });
    module.exports = EventListItemView;
});
