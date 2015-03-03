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
            "click #addFileForm" : "onAddFileForm",
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf RadiationRegistView#
         */
        afterRendered : function() {
        },
        /**
         * 画像を追加ボタンを押された際のコールバック関数
         * @memberOf RadiationRegistView#
         */
        onAddFileForm : function() {
//            this.insertView("#radiationFileArea", new OpeSlideshowRegistFileItemView()).render();
//            if ($("#radiationFileArea").children().size() >= 5) {
//                this.$el.find("#addFileForm").hide();
//            }
        },
        /**
         * 確認画面押下時のコールバック関数
         * @memberOf RadiationRegistView#
         */
        onClickRadiationConfirmButton : function() {
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
            var $fileAreas = this.$el.find("#radiationFileArea").children();
            var $previewImgs = $fileAreas.find("[data-preview-file]");
            var existFile = _.find($previewImgs, function(prevImg) {
                return !!$(prevImg).prop("file");
            });
            if (!existFile) {
                return "CSVファイルを1つ以上登録してください。";
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
