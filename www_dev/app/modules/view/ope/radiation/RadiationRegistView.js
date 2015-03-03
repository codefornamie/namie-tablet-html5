define(function(require, exports, module) {

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var AutomotiveDosimeterRecordValidator = require("modules/util/AutomotiveDosimeterRecordValidator");
    var vexDialog = require("vexDialog");
    var CommonUtil = require("modules/util/CommonUtil");

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
            this.convertFile();
//            // 登録処理を開始する
//            this.setInputValue();
//            $("#slideshowRegistPage").hide();
//            this.setView("#slideshowRegistConfirmWrapperPage", new OpeSlideshowRegistConfirmView({
//                models : this.models,
//            })).render();
//            $("#snap-content").scrollTop(0);
        },
        /**
         * 選択されたファイルをデータとして扱える形に変換する
         * @memberOf RadiationRegistView#
         */
        convertFile : function() {
            var reader = new FileReader();
            var file = this.$el.find("#radiationFile").prop("files")[0];

            // fileのロード完了後のコールバック
            reader.onload = function() {
                var originalRecords;
//                var validator = new AutomotiveDosimeterRecordValidator();
                // 1. CSV形式のデータをJSONオブジェクトに変換
                try {
                    if (file.type !== "text/csv" && file.type !== "text/comma-separated-values") {
                        throw new Error("couldn't accept file type: " + file.type);
                    }

                    originalRecords = CommonUtil.convertJsonObject(reader.result, {
                        cast : [
                                "String", "Number", "Number", "Number", "Number", "Number"
                        ]
                    });
                } catch (e) {
                    app.logger.error("CommonUtil.convertJsonObject():error=" + e);
                    next([
                            file.name, " をCSVファイルとして読み込むことができませんでした。", "ファイル形式を再度ご確認下さい。"
                    ].join(""));
                    return;
                }

                // TODO 2. 不正なレコードは省く
//                file.jsonObject = validator.validate(originalRecords);
                file.jsonObject = originalRecords;

                // TODO 3. 不正なレコードを省いた旨を通知する
//                vexDialog.defaultOptions.className = "vex-theme-default";
//
//                if (validator.hasError(Code.ERR_NO_RECORD)) {
//                    vexDialog.alert({
//                        message : [
//                            file.name,
//                            " は何らかの原因により壊れているため、情報を登録できませんでした。"
//                        ].join("")
//                    });
//                } else if (validator.hasError(Code.ERR_POSITION_MISSING)) {
//                    vexDialog.alert({
//                        message : [
//                            file.name,
//                            " は何らかの原因により壊れているため、一部の情報を登録できませんでした。",
//                            "正常な情報については、登録が完了しました。"
//                        ].join("")
//                    });
//                } else if (validator.hasError(Code.ERR_DOSE_MISSING)) {
//                    vexDialog.alert({
//                        message : [
//                            file.name,
//                            " は何らかの原因により壊れているため、一部の情報を登録できませんでした。",
//                            "正常な情報については、登録が完了しました。"
//                        ].join("")
//                    });
//                }

                // TODO 4. レコードをもとにRadiationClusterModelを作成
//                var radiationClusterModel = this.createRadiationClusterModel(file, validator.errorCode);
//
//                // TODO 5. Model保存処理
//                this.saveClusterModel(radiationClusterModel, file, next);
                
                
                
                // テスト確認用
                vexDialog.defaultOptions.className = 'vex-theme-default';
                vexDialog.alert(JSON.stringify(file.jsonObject));
                $(".vex-content").width(900);
                // ここまで

            }.bind(this);

            // テキストとしてファイルを読み込む
            reader.readAsText(file, "Shift-JIS");
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
