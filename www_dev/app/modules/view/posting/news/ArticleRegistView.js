define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleRegistFileItemView = require("modules/view/posting/news/ArticleRegistFileItemView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var DateUtil = require("modules/util/DateUtil");

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
            this.chageMultiDateCheckbox();
            var tomorrow = DateUtil.addDay(new Date(),1);
            $("#articleRangeDate1").val(DateUtil.formatDate(tomorrow,"yyyy-MM-dd"));
        },

        initialize : function() {
            this.insertView("#fileArea", new ArticleRegistFileItemView());
        },

        events : {
            "click #addFileForm" : "onAddFileForm",
            "click #articleRegistButton" : "onClickArticleRegistButton",
            "change #articleMultiDate" : "chageMultiDateCheckbox"
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
        onClickArticleRegistButton : function() {
            if ($(this.formId).validate().form()) {
                this.showLoading();
                // this.onSubmit();
            }
        },
        /**
         * モデルにデータをセットする関数
         */
        setInputValue : function() {
        },
        /**
         * 添付された画像をdavへ登録する
         */
        saveArticlePicture : function() {
            var reader = new FileReader();
            var contentType = "";
            reader.onload = $.proxy(function(fileEvent) {
                var options = {
                    body : fileEvent.currentTarget.result,
                    headers : {
                        "Content-Type" : contentType,
                        "If-Match" : "*"
                    }
                };
                app.box.col("dav").put(this.fileName, options);
            }, this);
            var file = $("#articleFile").prop("files")[0];
            contentType = file.type;
            var preName = file.name.substr(0, file.name.lastIndexOf("."));
            var suffName = file.name.substr(file.name.lastIndexOf("."));
            this.fileName = preName + "_" + String(new Date().getTime()) + suffName;
            reader.readAsArrayBuffer(file);
        },
        /**
         * バリデーションチェックがOKとなり、登録処理が開始された際に呼び出されるコールバック関数。
         */
        onSubmit : function() {
            try {
                // 登録処理を開始する
                if ($('#previewFile').attr("src")) {
                    this.saveArticlePicture();
                }
                this.setInputValue();
                var self = this;
                this.model.save(null, {
                    success : function() {
                        setTimeout(function() {
                            self.hideLoading();
                            app.router.go("eventsRegisted");
                        }, 1000);
                    }
                });
            } catch (e) {
                return;
            }
        },

    });
    module.exports = ArticleRegistView;
});
