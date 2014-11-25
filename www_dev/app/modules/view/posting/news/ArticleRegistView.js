define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleRegistFileItemView = require("modules/view/posting/news/ArticleRegistFileItemView");
    var ArticleRegistConfirmView = require("modules/view/posting/news/ArticleRegistConfirmView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var DateUtil = require("modules/util/DateUtil");
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
        model: null,
        /**
         * フォーム要素のID
         */
        formId : '#articleRegistForm',
        /**
         * 画像名
         */
        fileName : '',

        beforeRendered : function() {

        },

        afterRendered : function() {
            if (this.model) {
                // 編集時
                this.setData();
            } else {
                var tomorrow = DateUtil.addDay(new Date(),1);
                $("#articleRangeDate1").val(DateUtil.formatDate(tomorrow,"yyyy-MM-dd"));
                this.insertView("#fileArea", new ArticleRegistFileItemView()).render();
            }
            this.chageMultiDateCheckbox();
        },

        initialize : function() {
        },

        events : {
            "click #addFileForm" : "onAddFileForm",
            "click #articleConfirmButton" : "onClickArticleConfirmButton",
            "click #articleCancelButton" : "onClickArticleCancelButton",
            "change #articleMultiDate" : "chageMultiDateCheckbox"
        },
        /**
         * 編集時にデータを各フォームにセットする
         */
        setData: function () {
            $("#articleRegistTitle").text("記事編集");
            $("#articleCategory").val(this.model.get("type"));
            $("#articleTitle").val(this.model.get("title"));
            $("#articleDate1").val(this.model.get("startDate"));
            if (this.model.get("endDate")) {
                $("#articleMultiDate").attr("checked","checked");
                $("#articleDate2").val(this.model.get("endDate"));
            }
            $("#articleTime1").val(this.model.get("startTime"));
            $("#articleTime2").val(this.model.get("endTime"));
            $("#articlePlace").val(this.model.get("place"));
            $("#articleDetail").val(this.model.get("description"));
            $("#articleContact").val(this.model.get("contactInfo"));
            $("#articleRangeDate1").val(this.model.get("publishedAt"));
            $("#articleRangeDate2").val(this.model.get("depublishedAt"));
            if (this.model.get("type") !== "2") {
                var imgArray = [];
                if (this.model.get("imageUrl")) {
                    imgArray.push({
                        imageUrl:this.model.get("imageUrl"),
                        imageComment:this.model.get("imageComment")
                    });
                }
                if (this.model.get("imageUrl2")) {
                    imgArray.push({
                        imageUrl: this.model.get("imageUrl2"),
                        imageComment: this.model.get("imageComment2")
                    });
                }
                if (this.model.get("imageUrl3")) {
                    imgArray.push({
                        imageUrl: this.model.get("imageUrl3"),
                        imageComment: this.model.get("imageComment3")
                    });
                }
                this.imgArrayLength = imgArray.length;
                if (this.imgArrayLength === 0) {
                    this.insertView("#fileArea", new ArticleRegistFileItemView()).render();
                    this.hideLoading();
                } else if (this.imgArrayLength >= 3) {
                    $("#addFileForm").hide();
                }
                var index = 0;
                _.each(imgArray,$.proxy(function(img) {
                    var view = new ArticleRegistFileItemView();
                    view.imageUrl = img.imageUrl;
                    view.imageComment = img.imageComment;
                    this.insertView("#fileArea", view).render();
                    // 全ての画像の読み込み処理が完了したタイミングでローディングマスクを解除したいため
                    // 子要素で画像読み込み完了時に発火したchangeイベントを拾って最後の画像読み込み完了時にhideLoadingする
                    view.$el.find("#previewFile").on("change",$.proxy(function() {
                        index++;
                        if (index >= this.imgArrayLength) {
                            this.hideLoading();
                            // 全ての画像読み込み完了した場合は、もうchageイベントは拾わない
                            $("img#previewFile").off("change");
                        }
                    },this));
                },this));
            }
        },
        /**
         * キャンセルボタン押下時のコールバック関数
         */
        onClickArticleCancelButton: function () {
            app.router.back();
        },
        /**
         * 複数日チェックボックスのチェック有無でフォームを切り替える関数
         */
        chageMultiDateCheckbox : function() {
            if ($("#articleMultiDate").is(":checked")) {
                $(".articleDateTo").show();
            } else {
                $(".articleDateTo").hide();
            }
        },
        /**
         * 画像を追加ボタンを押された際のコールバック関数
         */
        onAddFileForm : function() {
            this.insertView("#fileArea", new ArticleRegistFileItemView()).render();
            if ($("#fileArea").children().size() >= 3) {
                $("#addFileForm").hide();
            }
        },
        /**
         * 確認画面へボタンを押された際のコールバック関数
         */
        onClickArticleConfirmButton : function() {
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
         * バリデーションチェック
         */
        validate : function(){
            if($("#articleMultiDate").is(":checked")){
                if($("#articleDate1").val() > $("#articleDate2").val()){
                    return "日時の日付が開始と終了で逆になっています。";
                }
            }
            if ($("#articleTime1").val() && $("#articleTime2").val() && $("#articleTime1").val() > $("#articleTime2").val()) {
                return "日時の時間が開始と終了で逆になっています。";
            }
            if ($("#articleRangeDate1").val() && $("#articleRangeDate2").val() && $("#articleRangeDate1").val() > $("#articleRangeDate2").val()) {
                return "掲載期間の日付が開始と終了で逆になっています。";
            }
            return null;
        },
        /**
         * モデルにデータをセットする関数
         */
        setInputValue : function() {
            if(this.model === null){
                this.model = new ArticleModel(); 
            }
            this.model.set("type", $("#articleCategory").val());
            this.model.set("site", $("#articleCategory").text());
            this.model.set("title", $("#articleTitle").val());
            
            this.model.set("startDate", $("#articleDate1").val());
            if ($("#articleMultiDate").is(":checked")) {
                this.model.set("endDate", $("#articleDate2").val());
            }
            this.model.set("startTime", $("#articleTime1").val());
            this.model.set("endTime", $("#articleTime2").val());

            this.model.set("place", $("#articlePlace").val());
            this.model.set("description", $("#articleDetail").val());
            this.model.set("contactInfo", $("#articleContact").val());
            
            this.model.set("publishedAt", $("#articleRangeDate1").val());
            this.model.set("depublishedAt", $("#articleRangeDate2").val());
            
            this.model.set("status", "0");
            this.model.set("createUserId", app.user.get("__id"));
            
            var imageCount = this.$el.find("#fileArea").children().size();
            var images = [];
            var self = this;
            _.each(this.$el.find("#fileArea").children(), function(fileItem){
                var previewImg = $(fileItem).find("#previewFile");
                var file = previewImg.prop("file");
                if(file){
                    var image = {};
                    var preName = file.name.substr(0, file.name.lastIndexOf("."));
                    var suffName = file.name.substr(file.name.lastIndexOf("."));
                    image.fileName = preName + "_" + String(new Date().getTime()) + suffName;
                    image.contentType = file.type;
                    image.src = previewImg.attr("src");
                    image.data = $(fileItem).find("#articleFile").prop("data");

                    image.comment = $(fileItem).find("#articleFileComent").val();
                    images.push(image);
                }
            });
            this.model.set("images", images);
            for(var i = 0; i < images.length; i++){
                var surfix = (i === 0) ? "" : "" + (i + 1);
                this.model.set("imageUrl" + surfix, images[i].fileName);
                this.model.set("imageComment" + surfix, images[i].comment);
            }
        },
        /**
         * バリデーションチェックがOKとなり、登録処理が開始された際に呼び出されるコールバック関数。
         */
        onSubmit : function() {
            // 登録処理を開始する
            this.setInputValue();
            $("#articleRegistPage").hide();
            this.setView("#articleRegistConfirmWrapperPage", new ArticleRegistConfirmView({model: this.model})).render();
            $("#snap-content").scrollTop(0);
        },

    });
    module.exports = ArticleRegistView;
});
