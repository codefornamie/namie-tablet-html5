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
    var AbstractModel = require("modules/model/AbstractModel");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleRegistFileItemView = require("modules/view/posting/news/ArticleRegistFileItemView");
    var ArticleRegistConfirmView = require("modules/view/posting/news/ArticleRegistConfirmView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var DateUtil = require("modules/util/DateUtil");
    var BusinessUtil = require("modules/util/BusinessUtil");
    var CommonUtil = require("modules/util/CommonUtil");
    var Code = require("modules/util/Code");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var vexDialog = require("vexDialog");

    /**
     * 記事新規登録画面のViewクラス
     * 
     * @class 記事新規登録画面のViewクラス
     * @exports ArticleRegistView
     * @constructor
     */
    var ArticleRegistView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/news/articleRegist"),
        /**
         * このビューのModel
         */
        model : null,
        /**
         * フォーム要素のID
         */
        formId : '#articleRegistForm',
        /**
         * 画像名
         */
        fileName : '',
        /**
         * 読み込み時のイメージ配列
         */
        imgArray : null,
        /**
         * サムネイルの元画像のByteArray
         * サムネイルを生成する必要がない場合はnull
         */
        thumbImageByteArray : null,

        beforeRendered : function() {

        },

        afterRendered : function() {
            $("#snap-content").scrollTop(0);

            // 記事カテゴリ選択肢
            var mapCategory = _.indexBy(Code.ARTICLE_CATEGORY_LIST, "key");
            _.each(Code.ARTICLE_CATEGORY_LIST_BY_MODE[app.config.basic.mode], function(key) {
                var category = mapCategory[key];
                var option = $("<option>");
                option.attr("value", category.key);
                option.text((category.valueByMode ? category.valueByMode[app.config.basic.mode] : null) || category.value);
                option.data("site", category.value);
                $("#articleCategory").append(option);
            });

            if (this.model) {
                // 編集時
                this.setData();
            } else {
                var tomorrow = DateUtil.addDay(new Date(), 1);
                $("#articleRangeDate1").val(DateUtil.formatDate(tomorrow, "yyyy-MM-dd"));
                this.insertView("#fileArea", new ArticleRegistFileItemView()).render();

                // 記事カテゴリ初期値
                if (this.articleCategory) {
                    $("#articleCategory").val(this.articleCategory);
                }
                // レポートを書く場合
                if (this.parentModel) {
                    $("#articleTitle").val(this.parentModel.get("title") + "の報告");
                    $("#articleDate1").val(this.parentModel.get("startDate"));
                    if (this.parentModel.get("endDate")) {
                        $("#articleMultiDate").attr("checked", "checked");
                        $("#articleDate2").val(this.parentModel.get("endDate"));
                    }
                    $("#articleTime1").val(this.parentModel.get("startTime"));
                    $("#articleTime2").val(this.parentModel.get("endTime"));
                    $("#articlePlace").val(this.parentModel.get("place"));
                    $("#articleContact").val(this.parentModel.get("contactInfo"));
                }
            }
            this.chageMultiDateCheckbox();
            this.onChangeCategory();
        },

        /**
         * バリデータの設定を行う
         * @memberOf ArticleRegistView#
         */
        setValidator : function() {
            $("#articleRegistForm input,#articleRegistForm textArea").removeClass("required");

            var articleCategory = $("#articleCategory").val();
            $("#articleRangeDate1").addClass("required");
            switch (articleCategory) {
            case "3":
            case "4":
            case "9":
            case "10":
                $("#articleTitle").addClass("required");
                $("#articleDate1").addClass("required");
                break;
            case "6":
                $("#articleDetail").addClass("required");
                $("#articleNickname").addClass("required");
                break;
            default:
                $("#articleTitle").addClass("required");
                break;
            }
        },

        initialize : function() {
        },

        events : {
            "click #addFileForm" : "onAddFileForm",
            "click #articleConfirmButton" : "onClickArticleConfirmButton",
            "click #articleCancelButton" : "onClickArticleCancelButton",
            "change #articleMultiDate" : "chageMultiDateCheckbox",
            "change #articleCategory" : "onChangeCategory"
        },
        /**
         * 編集時にデータを各フォームにセットする
         * @memberOf ArticleRegistView#
         */
        setData : function() {
            $("#articleRegistTitle").text("記事編集");
            $("#articleCategory").val(this.model.get("type"));
            $("#articleTitle").val(this.model.get("title"));
            $("#articleDate1").val(this.model.get("startDate"));
            if (this.model.get("endDate")) {
                $("#articleMultiDate").attr("checked", "checked");
                $("#articleDate2").val(this.model.get("endDate"));
            }
            $("#articleTime1").val(this.model.get("startTime"));
            $("#articleTime2").val(this.model.get("endTime"));
            $("#articlePlace").val(this.model.get("place"));
            $("#articleDetail").val(this.model.get("description"));
            $("#articleNickname").val(this.model.get("nickname"));
            $("#articleContact").val(this.model.get("contactInfo"));
            $("#articleRangeDate1").val(this.model.get("publishedAt"));
            $("#articleRangeDate2").val(this.model.get("depublishedAt"));
            if (this.model.get("type") !== "2") {
                this.imgArray = [];
                if (this.model.get("imageUrl")) {
                    this.imgArray.push({
                        fileName : this.model.get("imageUrl"),
                        comment : this.model.get("imageComment")
                    });
                }
                if (this.model.get("imageUrl2")) {
                    this.imgArray.push({
                        fileName : this.model.get("imageUrl2"),
                        comment : this.model.get("imageComment2")
                    });
                }
                if (this.model.get("imageUrl3")) {
                    this.imgArray.push({
                        fileName : this.model.get("imageUrl3"),
                        comment : this.model.get("imageComment3")
                    });
                }
                if (this.imgArray.length === 0) {
                    this.insertView("#fileArea", new ArticleRegistFileItemView()).render();
                    this.hideLoading();
                } else if (this.imgArray.length >= 3) {
                    $("#addFileForm").hide();
                }
                var index = this.imgArray.length;
                _.each(this.imgArray, $.proxy(function(img) {
                    var view = new ArticleRegistFileItemView();
                    view.imageUrl = this.model.get("imagePath") + "/" + img.fileName;
                    view.imageComment = img.comment;
                    this.insertView("#fileArea", view).render();
                    // 全ての画像の読み込み処理が完了したタイミングでローディングマスクを解除したいため
                    // 子要素で画像読み込み完了時に発火したchangeイベントを拾って最後の画像読み込み完了時にhideLoadingする
                    view.$el.find("#previewFile").on("change", $.proxy(function() {
                        if (--index <= 0) {
                            this.hideLoading();
                            // 全ての画像読み込み完了した場合は、もうchageイベントは拾わない
                            $("img#previewFile").off("change");
                        }
                    }, this));
                }, this));
            }
        },
        /**
         * キャンセルボタン押下時のコールバック関数
         * @memberOf ArticleRegistView#
         */
        onClickArticleCancelButton : function() {
            if (this.backFunction) {
                this.backFunction();
            } else {
                app.router.back();
            }
        },
        /**
         * 複数日チェックボックスのチェック有無でフォームを切り替える関数
         * @memberOf ArticleRegistView#
         */
        chageMultiDateCheckbox : function() {
            if ($("#articleMultiDate").is(":checked")) {
                $(".articleDateTo").show();
            } else {
                $(".articleDateTo").hide();
            }
        },
        /**
         * カテゴリを変更された際に呼び出されるコールバック関数
         * @memberOf ArticleRegistView#
         */
        onChangeCategory : function() {
            var articleCategory = $("#articleCategory").val();
            if (articleCategory === "6") {
                if ($("#fileArea").children().size() >= 1) {
                    $("#addFileForm").hide();
                }
            } else {
                $("#addFileForm").show();
            }
            if (articleCategory === "5") {
                $(".unnecessaryInTownArticle").fadeOut();
            } else {
                $(".unnecessaryInTownArticle").fadeIn();
            }
            this.setValidator();
        },
        /**
         * 画像を追加ボタンを押された際のコールバック関数
         * @memberOf ArticleRegistView#
         */
        onAddFileForm : function() {
            this.insertView("#fileArea", new ArticleRegistFileItemView()).render();
            if ($("#fileArea").children().size() >= 3) {
                $("#addFileForm").hide();
            }
        },
        /**
         * 確認画面へボタンを押された際のコールバック関数
         * @memberOf ArticleRegistView#
         */
        onClickArticleConfirmButton : function() {
            if ($(this.formId).validate().form()) {
                var errmsg = this.validate();
                if (errmsg) {
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert(errmsg);
                } else {
                    if ($("#articleCategory").val() === "5") {
                        $(".unnecessaryInTownArticle input,.unnecessaryInTownArticle textArea").val("");
                    }
                    this.onSubmit();
                }
            }
        },
        /**
         * バリデーションチェック
         * @memberOf ArticleRegistView#
         * @return {String} エラーメッセージ。正常の場合はnullを返す
         */
        validate : function() {
            if ($("#articleMultiDate").is(":checked")) {
                if ($("#articleDate1").val() > $("#articleDate2").val()) {
                    return "日時の日付が開始と終了で逆になっています。";
                }
            }
            if ($("#articleTime1").val() && $("#articleTime2").val() &&
                    $("#articleTime1").val() > $("#articleTime2").val()) {
                return "日時の時間が開始と終了で逆になっています。";
            }
            if ($("#articleRangeDate1").val() && $("#articleRangeDate2").val() &&
                    $("#articleRangeDate1").val() > $("#articleRangeDate2").val()) {
                return "掲載期間の日付が開始と終了で逆になっています。";
            }
            if ($("#articleRangeDate1").val() <= DateUtil.formatDate(BusinessUtil.getCurrentPublishDate(), "yyyy-MM-dd")) {
                return "掲載開始日に指定した日付は、すでに新聞が発行済みです。";
            }
            return null;
        },
        /**
         * モデルにデータをセットする関数
         * @memberOf ArticleRegistView#
         */
        setInputValue : function() {
            if (this.model === null) {
                this.model = new ArticleModel();
                this.model.id = AbstractModel.createNewId();
            }
            if (this.model.get("type") === "2") {
                this.model.set("title", $("#articleTitle").val());
                this.model.set("description", $("#articleDetail").val());
                return;
            }
            if(!this.model.get("imagePath")){
                this.model.set("imagePath", this.generateFilePath());
            }
            
            if (this.parentModel) {
                this.model.set("parent", this.parentModel.get("__id"));
            }

            this.model.set("type", $("#articleCategory").val());
            this.model.set("site", $("#articleCategory option:selected").data("site"));
            this.model.set("title", $("#articleTitle").val());

            this.model.set("startDate", $("#articleDate1").val());

            if ($("#articleMultiDate").is(":checked")) {
                this.model.set("endDate", $("#articleDate2").val());
            }

            this.model.set("startTime", $("#articleTime1").val());
            this.model.set("endTime", $("#articleTime2").val());

            this.model.set("place", $("#articlePlace").val());
            this.model.set("description", $("#articleDetail").val());
            this.model.set("nickname", $("#articleNickname").val());
            this.model.set("contactInfo", $("#articleContact").val());

            this.model.set("publishedAt", $("#articleRangeDate1").val());
            this.model.set("depublishedAt", $("#articleRangeDate2").val());

            this.model.set("status", "0");
            this.model.set("createUserId", app.user.get("__id"));

            var imageCount = this.$el.find("#fileArea").children().size();
            var images = [];
            var self = this;
            var $fileAreas = this.$el.find("#fileArea").children();

            /**
             * ファイル名を元に、ユニークなID付きのファイル名を生成する
             * @param {String} fileName
             * @return {String}
             */
            var generateFileName = function(fileName) {
                fileName = CommonUtil.blankTrim(fileName);
                var preName = fileName.substr(0, fileName.lastIndexOf("."));
                preName = preName.substr(0,100);
                preName = preName.replace(/[\[\]()\{\}]/g,"_");
                var suffName = fileName.substr(fileName.lastIndexOf("."));

                return preName + "_" + new Date().getTime() + _.uniqueId("") + suffName;
            };

            // サムネイルの基となる画像
            this.thumbImageByteArray = undefined;
            
            // サムネイル画像に使うviewの
            
            // 画像に変更があるかチェックする
            for (var i = 0; i < $fileAreas.length; i++) {
                var $fileArea = $fileAreas.eq(i);
                var fileAreaView = $fileArea.data("view");
                if( fileAreaView.imageByteArray ) {
                    if( this.thumbImageByteArray === undefined) {
                        if(fileAreaView.isChangeImage || i !== 0) {
                            this.thumbImageByteArray = fileAreaView.imageByteArray;
                        } else {
                            this.thumbImageByteArray = null;
                        }
                    }
                    var $previewImg = $fileArea.find("[data-preview-file]");
                    var file = $previewImg.prop("file");
                    var src = $previewImg.attr("src");
                    var comment = $fileArea.find("#articleFileComent").val();
                    var image;

                    if (!src) {
                        continue;
                    }

                    // 画像に変更があれば情報を更新する
                    if (file) {
                        image = {};

                        image.fileName = generateFileName(file.name);
                        image.contentType = file.type;
                        image.data = $fileArea.find("#articleFile").prop("data");
                    } else {
                        image = this.imgArray[i];
                    }

                    // 画像の情報を更新する
                    if (image) {
                        image.comment = comment;
                        image.src = src;
                    }

                    images.push(image);
                }
            }

            // imagesを元に、imageUrlとimageCommentを更新する
            for (var imageIndex = 0; imageIndex < 3; imageIndex++) {
                // { "", 2, 3, ... }
                var surfix = (imageIndex === 0) ? "" : "" + (imageIndex + 1);
                var img = images[imageIndex] || {};

                this.model.set("imageUrl" + surfix, img.fileName);
                this.model.set("imageComment" + surfix, img.comment);
            }

            this.model.set("images", images);
            
            // サムネイルのURL
            if ( this.thumbImageByteArray === undefined ) {
                // 画像なしなので、サムネイルもなし
                this.model.set("imageThumbUrl", null);
            } else {
                this.model.set("imageThumbUrl", "thumbnail.png");
            }
        },

        /**
         * バリデーションチェックがOKとなり、登録処理が開始された際に呼び出されるコールバック関数。
         * @memberOf ArticleRegistView#
         */
        onSubmit : function() {
            // 登録処理を開始する
            this.setInputValue();
            $("#articleRegistPage").hide();
            this.setView("#articleRegistConfirmWrapperPage", new ArticleRegistConfirmView({
                model : this.model,
                thumbImageByteArray : this.thumbImageByteArray
            })).render();
            $("#snap-content").scrollTop(0);
        },

    });
    module.exports = ArticleRegistView;
});
