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

    var app = require("app");
    var ArticleRegistView = require("modules/view/posting/news/ArticleRegistView");
    var OpeSlideshowRegistFileItemView = require("modules/view/ope/slideshow/OpeSlideshowRegistFileItemView");
    var OpeSlideshowRegistConfirmView = require("modules/view/ope/slideshow/OpeSlideshowRegistConfirmView");
    var AbstractModel = require("modules/model/AbstractModel");
    var SlideshowModel = require("modules/model/slideshow/SlideshowModel");
    var vexDialog = require("vexDialog");
    var DateUtil = require("modules/util/DateUtil");

    /**
     * スライドショー新規登録・編集画面のViewクラス
     * 
     * @class スライドショー新規登録・編集画面のViewクラス
     * @exports OpeSlidoshowRegistView
     * @constructor
     */
    var OpeSlidoshowRegistView = ArticleRegistView.extend({
        template : require("ldsh!templates/{mode}/slideshow/slideshowRegist"),
        file : null,
        image : {},
        /**
         * フォーム要素のID
         */
        formId : '#slideshowRegistForm',
        events : {
            "click #addFileForm" : "onAddFileForm",
            "click #slideshowCancelButton" : "onClickSlideshowCancelButton",
            "click #slideshowConfirmButton" : "onClickSlideshowConfirmButton"
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf OpeSlidoshowRegistView#
         */
        afterRendered : function() {
            var today = DateUtil.addDay(new Date());
            $("#slideshowRangeDate1").val(DateUtil.formatDate(today, "yyyy-MM-dd"));
            this.insertView("#slideshowFileArea", new OpeSlideshowRegistFileItemView()).render();
        },
        /**
         * 画像を追加ボタンを押された際のコールバック関数
         * @memberOf ArticleRegistView#
         */
        onAddFileForm : function() {
            this.insertView("#slideshowFileArea", new OpeSlideshowRegistFileItemView()).render();
            if ($("#slideshowFileArea").children().size() >= 5) {
                this.$el.find("#addFileForm").hide();
            }
        },
        /**
         * 確認画面押下時のコールバック関数
         * @memberOf OpeSlidoshowRegistView#
         */
        onClickSlideshowConfirmButton : function() {
            if ($(this.formId).validate().form()) {
                var errmsg = this.validate();
                if (errmsg) {
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert(errmsg);
                } else {
                    this.onSubmit();
                }
            }
        },
        /**
         * キャンセルボタン押下時のコールバック関数
         * @memberOf OpeSlidoshowRegistView#
         */
        onClickSlideshowCancelButton : function() {
            if (this.backFunction) {
                this.backFunction();
            } else {
                app.router.back();
            }
        },
        /**
         * バリデーションチェックがOKとなり、登録処理が開始された際に呼び出されるコールバック関数。
         * @memberOf OpeSlidoshowRegistView#
         */
        onSubmit : function() {
            // 登録処理を開始する
            this.setInputValue();
            $("#slideshowRegistPage").hide();
            this.setView("#slideshowRegistConfirmWrapperPage", new OpeSlideshowRegistConfirmView({
                models : this.models,
            })).render();
            $("#snap-content").scrollTop(0);
        },
        /**
         * バリデーションチェック
         * @memberOf ArticleRegistView#
         * @return {String} エラーメッセージ。正常の場合はnullを返す
         */
        validate : function() {
            var $fileAreas = this.$el.find("#slideshowFileArea").children();
            var $previewImgs = $fileAreas.find("[data-preview-file]");
            var existFile = _.find($previewImgs, function(prevImg) {
                return !!$(prevImg).prop("file");
            });
            if (!existFile) {
                return "画像を1つ以上登録してください。";
            }
            return null;
        },
        /**
         * モデルにデータをセットする関数
         * @memberOf ArticleRegistView#
         */
        setInputValue : function() {
            this.models = [];
            var images = [];
            var $fileAreas = this.$el.find("#slideshowFileArea").children();
            var $previewImgs = $fileAreas.find("[data-preview-file]");
            // 画像に変更があるかチェックする
            for (var i = 0; i < $previewImgs.length; i++) {
                var $previewImg = $previewImgs.eq(i);
                var file = $previewImg.prop("file");
                var src = $previewImg.attr("src");
                var image;

                if (!src) {
                    continue;
                }
                var model = new SlideshowModel();
                model.id = AbstractModel.createNewId();

                if (file) {
                    image = {};
                    image.src = src;
                    image.fileName = this.generateFileName(file.name);
                    image.contentType = file.type;
                    image.data = $fileAreas.eq(i).find("#articleFile").prop("data");
                    model.set("image", image);
                    model.set("filename", image.fileName);
                    model.set("published", "1");
                } else {
                    continue;
                }

                this.models.push(model);
            }
        }

    });
    module.exports = OpeSlidoshowRegistView;
});
