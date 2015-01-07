define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var ArticleListItemView = require("modules/view/news/ArticleListItemView");
    // var FileAPIUtil = require("modules/util/FileAPIUtil");
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
         * @memberOf EventListItemView#
         */
        template : require("ldsh!templates/{mode}/news/eventsDetail"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         * @memberOf EventListItemView#
         */
        afterRendered : function() {
            this.showImage();
            this.afterRenderCommon();
            var dateString = DateUtil.formatDate(new Date(this.model.get("startDate")), "yyyy年MM月dd日(ddd)");
            if (this.model.get("endDate")) {
                dateString += " ～ " + DateUtil.formatDate(new Date(this.model.get("endDate")), "yyyy年MM月dd日(ddd)");
            }
            var st = this.model.get("startTime");
            st = st ? st : "";
            var et = this.model.get("endTime");
            et = et ? et : "";
            if (st || et) {
                dateString += "\n" + st + " ～ " + et;
            }
            $(this.el).find("#articleDateTime").html(CommonUtil.sanitizing(dateString));

        },
        /**
         * このViewが表示している記事に関連する画像データの取得と表示を行う。
         * @memberOf EventListItemView#
         */
        showImage : function() {
            var modelArray = [];
            var imgArray = [];

            if (this.model.get("letters")) {
                // おたより記事のリストを持っている場合は、その内容を対象とする
                modelArray = this.model.get("letters");
            } else {
                // その他の場合はモデル自身がもつ画像情報を対象とする
                modelArray.push(this.model);
            }

            _.each(modelArray, $.proxy(function(model) {
                for (var i = 1; i < 4; i++) {
                    var index = i;
                    if (i === 1) {
                        index = "";
                    }
                    if (model.get("imageUrl" + index)) {
                        imgArray.push({
                            imageUrl : model.get("imageUrl" + index),
                            imageComment : model.get("imageComment" + index),
                            imageIndex : i
                        });
                    } else {
                        $($(this.el).find(".eventFileImage img")[i - 1]).parent().parent().hide();
                    }
                }
            }, this));
            this.showPIOImages(".eventFileImage img", imgArray, true, $.proxy(this.onClickImage, this));
        },
    });
    module.exports = EventListItemView;
});
