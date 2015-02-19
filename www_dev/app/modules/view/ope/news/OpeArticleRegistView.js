define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var PostingArticleRegistView = require("modules/view/posting/news/ArticleRegistView");
    var OpeArticleRegistConfirmView = require("modules/view/ope/news/OpeArticleRegistConfirmView");
    var ArticleRegistFileItemView = require("modules/view/posting/news/ArticleRegistFileItemView");
    var vexDialog = require("vexDialog");

    /**
     * 記事新規登録・編集画面のViewクラス
     * 
     * @class 記事新規登録・編集画面のViewクラス
     * @exports OpeArticleRegistView
     * @constructor
     */
    var OpeArticleRegistView = PostingArticleRegistView.extend({
        /**
         * 編集時にデータを各フォームにセットする
         * @memberOf OpeArticleRegistView#
         */
        setData: function () {
            $("#articleRegistTitle").text("記事編集");
            if (this.model.get("type") === "2") {
                $("#articleCategory").val("5");
            } else {
                $("#articleCategory").val(this.model.get("type"));
            }
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
            $("#articleNickname").val(this.model.get("nickname"));
            $("#articleContact").val(this.model.get("contactInfo"));
            $("#articleRangeDate1").val(this.model.get("publishedAt"));
            $("#articleRangeDate2").val(this.model.get("depublishedAt"));
            if (this.model.get("isRecommend")) {
                $("#articleRecommendCheck").attr("checked","checked");
            }
            if (this.model.get("type") !== "2") {
                this.imgArray = [];
                if (this.model.get("imageUrl")) {
                    this.imgArray.push({
                        fileName:this.model.get("imageUrl"),
                        imageComment:this.model.get("imageComment")
                    });
                }
                if (this.model.get("imageUrl2")) {
                    this.imgArray.push({
                        fileName: this.model.get("imageUrl2"),
                        imageComment: this.model.get("imageComment2")
                    });
                }
                if (this.model.get("imageUrl3")) {
                    this.imgArray.push({
                        fileName: this.model.get("imageUrl3"),
                        imageComment: this.model.get("imageComment3")
                    });
                }
                this.imgArrayLength = this.imgArray.length;
                if (this.imgArrayLength === 0) {
                    this.insertView("#fileArea", new ArticleRegistFileItemView()).render();
                    this.hideLoading();
                } else if (this.imgArrayLength >= 3) {
                    $("#addFileForm").hide();
                }
                var index = 0;
                _.each(this.imgArray,$.proxy(function(img) {
                    var view = new ArticleRegistFileItemView();
                    view.imageUrl = this.model.get("imagePath") + "/" + img.fileName;
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
            } else {
                this.hideLoading();
            }
        },
        /**
         * モデルにデータをセットする関数
         * @memberOf OpeArticleRegistView#
         */
        setInputValue : function() {
            var type = this.model.get("type");
            if (type === "1" || type === "7" || type === "8") {
                this.model.set("publishedAt", $("#articleRangeDate1").val());
                this.model.set("depublishedAt", $("#articleRangeDate2").val());
            } else {
                PostingArticleRegistView.prototype.setInputValue.apply(this, arguments);
            }
            this.model.set("isRecommend", $("#articleRecommendCheck").is(":checked") ? "true" : null);
        },
        /**
         * バリデーションチェックがOKとなり、登録処理が開始された際に呼び出されるコールバック関数。
         * @memberOf OpeArticleRegistView#
         */
        onSubmit : function() {
            // 登録処理を開始する
            this.setInputValue();
            $("#articleRegistPage").hide();
            this.setView("#articleRegistConfirmWrapperPage", new OpeArticleRegistConfirmView({
                model : this.model,
                recommendArticle : this.recommendArticle,
                publishedAt : this.model.get("publishedAt"),
                thumbImageByteArray : this.thumbImageByteArray
            })).render();
            $("#contents__primary").scrollTop(0);
        },
        /**
         * バリデーションチェック
         * @memberOf OpeArticleRegistView#
         * @return {String} バリデーションメッセージ
         */
        validate : function() {
            if (this.model && this.model.get("type") === "2") {
                return null;
            }

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
            
            var articleCategory = $("#articleCategory").val();
            if (articleCategory === "6" && !$(this.el).find("#previewFile").attr("src")) {
                return "写真投稿は写真の登録が必須です。";
            }
            
            return null;
        },
        /**
         * キャンセルボタン押下時のコールバック関数
         */
        onClickArticleCancelButton : function() {
            if (this.backFunction) {
                this.backFunction();
            } else {
                app.router.go("ope-top", this.targetDate);
            }
        }
    });
    module.exports = OpeArticleRegistView;
});
