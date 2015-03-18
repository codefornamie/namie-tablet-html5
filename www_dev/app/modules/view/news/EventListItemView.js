/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
            var imgArray = [];

            if (this.model.get("articles")) {
                var index = 1;
                // 写真投稿記事のリストを持っている場合（写真投稿一覧記事の場合）は、その内容を対象とする
                var modelDayList = this.model.get("articles");
                _.each(modelDayList, $.proxy(function(modelDay) {
                    var modelArray = modelDay.get("articles");
                    _.each(modelArray, $.proxy(function(model) {
                        if (model.get("imageUrl")) {
                            var imagePath = model.get("imagePath") ? model.get("imagePath") + "/" : "";
                            imgArray.push({
                                hasPath : true,
                                imageUrl : imagePath + model.get("imageUrl"),
                                imageThumbUrl : imagePath + model.get("imageThumbUrl"),
                                imageComment : model.get("imageComment"),
                                imageIndex : index
                            });
                        } else {
                            $($(this.el).find(".eventFileImage img")[index - 1]).parent().parent().hide();
                        }
                        index++;
                    }, this));
                }));
            } else {
                // その他の場合（イベント記事の場合）はモデル自身がもつ画像情報を対象とする
                for (var i = 1; i < 4; i++) {
                    var indexPrefix = i;
                    if (i === 1) {
                        indexPrefix = "";
                    }
                    if (this.model.get("imageUrl" + indexPrefix)) {
                        imgArray.push({
                            imageUrl : this.model.get("imageUrl" + indexPrefix),
                            imageComment : this.model.get("imageComment" + indexPrefix),
                            imageIndex : i
                        });
                    } else {
                        $($(this.el).find(".eventFileImage img")[i - 1]).parent().parent().hide();
                    }
                }
            }
            this.showPIOImages(".eventFileImage img", imgArray, true, $.proxy(this.onClickImage, this));
        },
    });
    module.exports = EventListItemView;
});
