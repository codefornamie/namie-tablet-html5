define(function(require, exports, module) {

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var vexDialog = require("vexDialog");

    /**
     * スライドショー新規登録・編集画面のViewクラス
     * 
     * @class スライドショー新規登録・編集画面のViewクラス
     * @exports RadiationRegistView
     * @constructor
     */
    var RadiationRegistView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/radiation/radiationRegist"),
        /**
         * フォーム要素のID
         */
        formId : '#radiationRegistForm',
        events : {
            "change #radiationFile" : "onChangeFileData",
            "click #fileInputButton" : "onClickFileInputButton",
            "click #fileDeleteButton" : "onClickFileDeleteButton",
            "click #radiationUploadButton" : "onClickRadiationUploadButton",
            "click #radiationCancelButton" : "onClickRadiationCancelButton"
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf RadiationRegistView#
         */
        afterRendered : function() {
        },
        /**
         * 画像選択ボタン押下時のハンドラ
         * @memberOf RadiationRegistView#
         */
        onClickFileInputButton : function() {
            $("#uploadFileName").text("");
            $(this.el).find("#radiationFile")[0].click();
        },
        /**
         * ファイル選択時のハンドラ
         * @memberOf RadiationRegistView#
         * @param {Event} event チェンジイベント
         */
        onChangeFileData : function(event) {
            var file = event.target.files[0];
            $("#uploadFileName").text(file.name);
            $(this.el).find("#fileDeleteButton").show();
        },
        /**
         * ファイル削除ボタン押下時のハンドラ
         * @memberOf RadiationRegistView#
         */
        onClickFileDeleteButton : function() {
            $(this.el).find("#radiationFile").val("");
            $("#uploadFileName").text("");
            $(this.el).find("#fileDeleteButton").hide();
        },
        /**
         * アップロードボタン押下時のコールバック関数
         * @memberOf RadiationRegistView#
         */
        onClickRadiationUploadButton : function() {
            if ($(this.formId).validate().form()) {
                var errmsg = this.validate();
                if (errmsg) {
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert(errmsg);
                } else {
                    alert("バリデータチェックOK！");
//                    this.onSubmit();
                }
            }
        },
        /**
         * キャンセルボタン押下時のコールバック関数
         * @memberOf RadiationRegistView#
         */
        onClickRadiationCancelButton : function() {
            if (this.backFunction) {
                this.backFunction();
            } else {
                app.router.back();
            }
        },
        /**
         * バリデーションチェックがOKとなり、登録処理が開始された際に呼び出されるコールバック関数。
         * @memberOf RadiationRegistView#
         */
        onSubmit : function() {
//            // 登録処理を開始する
//            this.setInputValue();
//            $("#slideshowRegistPage").hide();
//            this.setView("#slideshowRegistConfirmWrapperPage", new OpeSlideshowRegistConfirmView({
//                models : this.models,
//            })).render();
//            $("#snap-content").scrollTop(0);
        },
        /**
         * バリデーションチェック
         * @memberOf RadiationRegistView#
         * @return {String} エラーメッセージ。正常の場合はnullを返す
         */
        validate : function() {
            var $file = this.$el.find("#radiationFile");
            if ($file.prop("files").length < 1) {
                return "アップロードファイルを選択してください。";
            }
            return null;
        },
        /**
         * モデルにデータをセットする関数
         * @memberOf RadiationRegistView#
         */
        setInputValue : function() {
        }

    });
    module.exports = RadiationRegistView;
});
