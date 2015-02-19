define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var PostingArticleRegistView = require("modules/view/posting/news/ArticleRegistView");
    var OpeArticleRegistConfirmView = require("modules/view/ope/news/OpeArticleRegistConfirmView");
    var ArticleRegistFileItemView = require("modules/view/posting/news/ArticleRegistFileItemView");
    var vexDialog = require("vexDialog");
    var Code = require("modules/util/Code");

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
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf OpeArticleRegistView#
         */
        afterRendered : function() {
            $("#snap-content").scrollTop(0);

            // 記事カテゴリ選択肢
            var mapCategory = _.indexBy(Code.ARTICLE_CATEGORY_LIST, "key");
            _.each(Code.ARTICLE_CATEGORY_LIST_BY_MODE[app.config.basic.mode], function(key) {
                var category = mapCategory[key];
                var option = $("<option>");
                option.attr("value", category.key);
                option.text((category.valueByMode ? category.valueByMode[app.config.basic.mode] : null) ||
                        category.value);
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

            if (this.model.get("type") === "1" || this.model.get("type") === "7" || this.model.get("type") === "8") {
                this.isMinpoArticle = this.model.isMinpoScraping();
                this.showImage();
                this.afterRenderCommon();
                this.hideLoading();
            }
            this.chageMultiDateCheckbox();
            this.onChangeCategory();
            this.$el.find("a").attr("href", "javascript:void(0)");
        },

        /**
         * このViewが表示している記事に関連する画像データの取得と表示を行う。
         * @memberOf OpeArticleRegistView#
         */
        showImage : function() {
            var self = this;
            var imageElems = $(this.el).find("img");

            if (this.isMinpoArticle) {
                // この記事のimg要素にはWebDAVのパスが設定されているため、取得しにいく
                _.each(imageElems, function(imageElement) {
                    var imageUrl = $(imageElement).attr("src");
                    this.showPIOImage($(imageElement), {
                        imageUrl : imageUrl
                    }, true, $.proxy(this.onClickImage, this));
                }.bind(this));
            } else {
                this.setColorbox(imageElems);
            }

            var articleImage = $(this.el).find(".articleDetailImage");

            if (this.model.get("imageUrl")) {
                articleImage.on("error", function() {
                    articleImage.hide();
                });
                var imageUrl = this.model.get("imageUrl");
                this.showPIOImage(articleImage, {
                    imageUrl : imageUrl
                }, true, $.proxy(this.onClickImage, this));
            } else {
                // ArticleListViewでiscrollを初期化する際に
                // 記事内のimgの読み込みを待機しているので
                // このimgは決して読み込まれないことを通知する
                articleImage.trigger('error', "this image will never be loaded");
                $(this.el).find(".articleDetailImageArea").hide();
            }

            if (this.model.get("imageUrl")) {
                $(this.el).find("#nehan-articleDetailImage").parent().css("width", "auto");
                $(this.el).find("#nehan-articleDetailImage").parent().css("height", "auto");
                $(this.el).find("#nehan-articleDetailImage").css("width", "auto");
                $(this.el).find("#nehan-articleDetailImage").css("height", "auto");
            }
        },

        /**
         * Viewの秒が処理の後の、記事表示処理で共通する処理を行う。
         * <p>
         * 以下の処理を行う。
         * <ul>
         * <li>お気に入りボタンの表示・非表示判定</li>
         * <li>タグの表示</li>
         * <li>画像クリックイベントのバインド<br/> 画像クリック時に、対象画像の保存処理を行うためのイベントをバインドする。 </li>
         * </p>
         * @memberOf OpeArticleRegistView#
         */
        afterRenderCommon : function() {
            // 既にお気に入り登録されている記事のお気に入りボタンを非表示にする
            if (this.model.get("isFavorite")) {
                this.$el.find('[data-favorite-register-button]').hide();
            } else {
                this.$el.find('[data-favorite-delete-button]').hide();
            }
            if (this.model.get("isMyRecommend")) {
                this.$el.find('[data-recommend-register-button]').hide();
            } else {
                this.$el.find('[data-recommend-delete-button]').hide();
            }
            $(".panzoom-elements").panzoom({
                minScale : 1,
                contain : "invert"
            });
        },

        /**
         * colorboxの設定を行う
         * @param {Array} imageElems img要素の配列
         * @memberOf OpeArticleRegistView#
         */
        setColorbox : function(imageElems) {
            imageElems.each(function() {
                if ($(this).attr("src")) {
                    $(this).wrap("<a class='expansionPicture' href='" + $(this).attr("src") + "'></a>");
                }
            });
            $(this.el).find(".expansionPicture").colorbox({
                closeButton : false,
                current : "",
                photo : true,
                maxWidth : "83%",
                maxHeight : "100%",
                onComplete : $.proxy(function() {
                    $("#cboxOverlay").append("<button id='cboxCloseButton' class='small button'>閉じる</button>");
                    $("#cboxOverlay").append("<button id='cboxSaveButton' class='small button'>画像を保存</button>");
                    $("#cboxCloseButton").click(function() {
                        $.colorbox.close();
                    });
                    $("#cboxSaveButton").click($.proxy(this.onClickImage, this));
                }, this),
                onClosed : function() {
                    $("#cboxSaveButton").remove();
                    $("#cboxCloseButton").remove();
                }
            });
        }
    });
    module.exports = OpeArticleRegistView;
});
