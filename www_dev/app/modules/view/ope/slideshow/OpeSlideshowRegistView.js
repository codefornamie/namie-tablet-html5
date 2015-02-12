define(function(require, exports, module) {

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleRegistView = require("modules/view/posting/news/ArticleRegistView");
    var ArticleRegistFileItemView = require("modules/view/posting/news/ArticleRegistFileItemView");
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
            "click #slideshowCancelButton" : "onClickSlideshowCancelButton",
            "click #slideshowConfirmButton" : "onClickSlideshowConfirmButton"
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了前に呼び出される。
         * @memberOf OpeSlidoshowRegistView#
         */
        beforeRendered : function() {
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf OpeSlidoshowRegistView#
         */
        afterRendered : function() {
            this.setData();
        },

        /**
         * 編集時にデータを各フォームにセットする
         * @memberOf OpeSlidoshowRegistView#
         */
        setData: function () {
            var today = DateUtil.addDay(new Date());
            $("#slideshowRangeDate1").val(DateUtil.formatDate(today, "yyyy-MM-dd"));
            this.insertView("#slideshowFileArea", new OpeSlideshowRegistFileItemView()).render();
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
                model : this.model,
            })).render();
            $("#snap-content").scrollTop(0);
        },
        /**
         * バリデーションチェック
         * @memberOf ArticleRegistView#
         * @return {String} エラーメッセージ。正常の場合はnullを返す
         */
        validate : function() {
            var $fileArea = this.$el.find("#slideshowFileArea").children().eq(0);
            var $previewImg = $fileArea.find("[data-preview-file]");
            if (!($previewImg.prop("file"))) {
                return "画像が選択されていません";
            }
            this.file = $previewImg.prop("file");

            this.image.contentType = this.file.type;
            this.image.data = $fileArea.find("#articleFile").prop("data");
            this.image.src = $previewImg.attr("src");

            return null;
        },
        /**
         * モデルにデータをセットする関数
         * @memberOf ArticleRegistView#
         */
        setInputValue : function() {
            if (this.model === null) {
                this.model = new SlideshowModel();
                this.model.id = AbstractModel.createNewId();
            }

            var fileName = this.generateFileName(this.file.name);
            this.image.fileName = fileName;
            this.model.set("image", this.image);

            this.model.set("filename", fileName);
            this.model.set("published", "1");
        }

    });
    module.exports = OpeSlidoshowRegistView;
});
