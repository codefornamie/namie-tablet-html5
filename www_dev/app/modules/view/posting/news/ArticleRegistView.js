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
        /**
         * 読み込み時のイメージ配列
         */
        imgArray : null,

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

                // 記事カテゴリ
                if(this.articleCategory){
                    $("#articleCategory").val(this.articleCategory);
                }
                // レポートを書く場合
                if(this.parentModel){
                    $("#articleTitle").val(this.parentModel.get("title") + "の報告");
                    $("#articleDate1").val(this.parentModel.get("startDate"));
                    if (this.parentModel.get("endDate")) {
                        $("#articleMultiDate").attr("checked","checked");
                        $("#articleDate2").val(this.parentModel.get("endDate"));
                    }
                    $("#articleTime1").val(this.parentModel.get("startTime"));
                    $("#articleTime2").val(this.parentModel.get("endTime"));
                    $("#articlePlace").val(this.parentModel.get("place"));
                    $("#articleContact").val(this.parentModel.get("contactInfo"));
                }
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
                this.imgArray = [];
                if (this.model.get("imageUrl")) {
                    this.imgArray.push({
                        fileName:this.model.get("imageUrl"),
                        comment:this.model.get("imageComment")
                    });
                }
                if (this.model.get("imageUrl2")) {
                    this.imgArray.push({
                        fileName: this.model.get("imageUrl2"),
                        comment: this.model.get("imageComment2")
                    });
                }
                if (this.model.get("imageUrl3")) {
                    this.imgArray.push({
                        fileName: this.model.get("imageUrl3"),
                        comment: this.model.get("imageComment3")
                    });
                }
                if (this.imgArray.length === 0) {
                    this.insertView("#fileArea", new ArticleRegistFileItemView()).render();
                    this.hideLoading();
                } else if (this.imgArray.length >= 3) {
                    $("#addFileForm").hide();
                }
                var index = 0;
                _.each(this.imgArray, $.proxy(function(img) {
                    var view = new ArticleRegistFileItemView();
                    view.imageUrl = img.fileName;
                    view.imageComment = img.comment;
                    this.insertView("#fileArea", view).render();
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
            if(this.parentModel){
                this.model.set("parent", this.parentModel.get("__id"));
            }
            this.model.set("type", $("#articleCategory").val());
            this.model.set("site", $("#articleCategory option:selected").text());
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
            var fileAreas = this.$el.find("#fileArea").children();
            for(var i = 0; i < fileAreas.length; i++){
                var fileArea = fileAreas[i];
                var previewImg = $(fileArea).find("#previewFile");
                var file = previewImg.prop("file");
                if(previewImg.attr("src")){
                    var image = null;
                    if(file){
                        image = {};
                        var preName = file.name.substr(0, file.name.lastIndexOf("."));
                        var suffName = file.name.substr(file.name.lastIndexOf("."));
                        image.fileName = preName + "_" + String(new Date().getTime()) + _.uniqueId("") + suffName;
                        image.contentType = file.type;
                        image.data = $(fileArea).find("#articleFile").prop("data");
                    }else{
                        // 変更なし
                        image = this.imgArray[i];
                    }
                    image.comment = $(fileArea).find("#articleFileComent").val();
                    image.src = previewImg.attr("src");
                    images.push(image);
                }
            }
            this.model.set("images", images);
            for(var imageIndex = 0; imageIndex < 3; imageIndex++){
                var surfix = (imageIndex === 0) ? "" : "" + (imageIndex + 1);
                this.model.set("imageUrl" + surfix, imageIndex < images.length ? images[imageIndex].fileName : null);
                this.model.set("imageComment" + surfix, imageIndex < images.length ? images[imageIndex].comment : null);
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
