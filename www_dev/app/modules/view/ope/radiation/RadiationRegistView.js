define(function(require, exports, module) {

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var AutomotiveDosimeterRecordValidator = require("modules/util/AutomotiveDosimeterRecordValidator");
    var vexDialog = require("vexDialog");
    var CommonUtil = require("modules/util/CommonUtil");
    var Code = require("modules/util/Code");
    var async = require("async");
    var moment = require("moment");
    var RadiationClusterModel = require("modules/model/radiation/RadiationClusterModel");
    var RadiationLogModel = require("modules/model/radiation/RadiationLogModel");

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
         * 放射線ログ情報を一度に登録する数
         */
        LOG_BULK_COUNT: 500,
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
                    this.saveProcess();
                }
            }
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
         * 選択されたファイルをデータとして扱える形に変換する
         * @memberOf RadiationRegistView#
         */
        saveProcess : function() {
            this.showProgressBarLoading();
            var reader = new FileReader();
            var file = this.$el.find("#radiationFile").prop("files")[0];

            // fileのロード完了後のコールバック
            reader.onload = function() {
                this.$progressBar.attr("value", 10);
                var originalRecords;
                var validator = new AutomotiveDosimeterRecordValidator();
                // 1. CSV形式のデータをJSONオブジェクトに変換
                try {
                    if (file.type !== "text/csv" && file.type !== "text/comma-separated-values" &&
                            file.type !== "application/vnd.ms-excel" && file.type !== "application/excel" &&
                            file.type !== "application/msexcel" && file.type !== "application/x-excel") {
                        throw new Error("couldn't accept file type: " + file.type);
                    }

                    originalRecords = CommonUtil.convertJsonObject(reader.result, {
                        cast : [
                                "String", "Number", "Number", "Number", "Number", "Number"
                        ]
                    });
                } catch (e) {
                    app.logger.error("CommonUtil.convertJsonObject():error=" + e);
                    vexDialog.defaultOptions.className = "vex-theme-default";
                    vexDialog.alert(file.name + " をCSVファイルとして読み込むことができませんでした。", "ファイル形式を再度ご確認下さい。");
                    this.hideLoading();
                    return;
                }

                // 2. 不正なレコードは省く
                file.jsonObject = validator.validate(originalRecords);
                this.$progressBar.attr("value", 10);

                this.perProgress = 90 / (file.jsonObject.length / this.LOG_BULK_COUNT + 1);

                // 3. 不正なレコードを省いた旨を通知する
                vexDialog.defaultOptions.className = "vex-theme-default";

                if (validator.hasError(Code.ERR_NO_RECORD)) {
                    vexDialog.alert({
                        message : [
                                file.name, " は何らかの原因により壊れているため、情報を登録できませんでした。"
                        ].join("")
                    });
                    this.hideLoading();
                    return;
                } else if (validator.hasError(Code.ERR_POSITION_MISSING)) {
                    vexDialog.alert({
                        message : [
                                file.name, " は何らかの原因により壊れているため、一部の情報を登録できませんでした。", "正常な情報については、登録を実施します。"
                        ].join("")
                    });
                } else if (validator.hasError(Code.ERR_DOSE_MISSING)) {
                    // 車載線量計のデータの最初のレコードが線量0のため、このバリデータは一時無効とする
//                    vexDialog.alert({
//                        message : [
//                                file.name, " は何らかの原因により壊れているため、一部の情報を登録できませんでした。", "正常な情報については、登録が完了しました。"
//                        ].join("")
//                    });
                }

                // 4. レコードをもとにRadiationClusterModelを作成
                var radiationClusterModel = this.createRadiationClusterModel(file, validator.errorCode);

                // // 5. Model保存処理
                this.saveClusterModel(radiationClusterModel, file);
            }.bind(this);

            // テキストとしてファイルを読み込む
            reader.readAsText(file, "Shift-JIS");
        },
        /**
         * clusterModelにデータをセットする
         * @memberOf RadiationRegistView#
         * @param {Object} file ファイルオブジェクト
         * @param {Number} errorCode アップロード時のエラーコード
         */
        createRadiationClusterModel : function(file, errorCode) {
            console.assert(typeof errorCode === "number", "errorCode should be a number");

            var radiationClusterModel = new RadiationClusterModel();
            // csvの時刻を日付型文字列に変換する
            this.convertToDate(file);

            // clustermodelに必要なデータの計算処理を実施
            this.calcDataForCluster(file);

            // modelにデータを詰める
            radiationClusterModel.set("userId", app.user.get("__id"));
            radiationClusterModel.set("startDate", file.startDate);
            radiationClusterModel.set("createDate", moment(file.lastModifiedDate).format());
            radiationClusterModel.set("endDate", file.endDate);
            radiationClusterModel.set("numSample", file.numSample);
            radiationClusterModel.set("maxValue", file.maxValue);
            radiationClusterModel.set("minValue", file.minValue);
            radiationClusterModel.set("averageValue", file.averageValue);
            radiationClusterModel.set("maxLatitude", file.maxLatitude);
            radiationClusterModel.set("minLatitude", file.minLatitude);
            radiationClusterModel.set("minLongitude", file.minLongitude);
            radiationClusterModel.set("maxLongitude", file.maxLongitude);
            radiationClusterModel.set("errorCode", errorCode);
            radiationClusterModel.set("isFixedStation", false);
            radiationClusterModel.set("measurementType", Code.RAD_MEASUREMENT_MUNICIPALITY);

            return radiationClusterModel;
        },
        /**
         * csvの時刻を日付型文字列に変換する
         * @memberOf RadiationRegistView#
         */
        convertToDate : function(file) {
            var data = file.jsonObject;
            var targetDate = this.$el.find("#measurementDate").val();
            var startTime = data[0][Code.AUTOMOTIVE_TITLE_TIME];
            _.each(data, function(json) {
                var targetTime = json[Code.AUTOMOTIVE_TITLE_TIME];
                if (startTime > targetTime) {
                    // 時刻が途中で減った場合は、日付をまたいだことになるため、付加する日付文字列を1日進める
                    targetDate = moment(targetDate).add(1, "d").format("YYYY-MM-DD");
                }
                json[Code.AUTOMOTIVE_TITLE_TIME] = targetDate + "T" + targetTime;
            });
        },
        /**
         * cluster用のデータを求める
         * @memberOf RadiationRegistView#
         * @param {Object} file ファイルオブジェクト
         */
        calcDataForCluster : function(file) {
            var data = file.jsonObject;

            // データから時間のみの配列を取得
            var dateTimes = _.map(data, function(obj) {
                return obj[Code.AUTOMOTIVE_TITLE_TIME];
            });
            file.startDate = _.min(dateTimes, function(date) {
                return new Date(date).getTime();
            });
            file.endDate = _.max(dateTimes, function(date) {
                return new Date(date).getTime();
            });
            file.numSample = data.length;

            // データから線量1のみの配列を取得
            var svs = _.map(data, function(obj) {
                return parseFloat(obj[Code.AUTOMOTIVE_TITLE_DOSE1]);
            });
            file.maxValue = _.max(svs, function(sv) {
                return sv;
            });
            file.minValue = _.min(svs, function(sv) {
                return sv;
            });
            file.averageValue = _.reduce(svs, function(pre, next) {
                return pre + next;
            }) / data.length;

            // データから緯度のみの配列を取得
            var latitudes = _.map(data, function(obj) {
                return parseFloat(obj[Code.AUTOMOTIVE_TITLE_LATITUDE]);
            });
            // データから軽度のみの配列を取得
            var longitudes = _.map(data, function(obj) {
                return parseFloat(obj[Code.AUTOMOTIVE_TITLE_LONGITUDE]);
            });

            file.maxLatitude = _.max(latitudes, function(lat) {
                return lat;
            });
            file.minLatitude = _.min(latitudes, function(lat) {
                return lat;
            });
            file.minLongitude = _.max(longitudes, function(lon) {
                return lon;
            });
            file.maxLongitude = _.min(longitudes, function(lon) {
                return lon;
            });
        },
        /**
         * cluster保存処理
         * @memberOf RadiationRegistView#
         * @param {Model} radiationClusterModel クラスターモデル
         * @param {Object} file ファイルオブジェクト
         */
        saveClusterModel : function(radiationClusterModel, file) {
            radiationClusterModel.save(null, {
                success : function(model) {
                    this.increaseProgress();
                    this.showSuccessMessage("放射線クラスター情報の保存", radiationClusterModel);
                    // clusterの保存に成功した場合はradiationLogの保存処理実施
                    this.setLogModels(model, file);
                }.bind(this),
                error : function(model, resp) {
                    this.showErrorMessage(file.name + "(放射線クラスター情報)の保存", resp);
                }.bind(this)
            });
        },
        /**
         * radiationLog作成処理後保存呼び出し
         * @memberOf RadiationRegistView#
         * @param {Model} radiationClusterModel クラスターモデル
         * @param {Object} file ファイルオブジェクト
         */
        setLogModels : function(radiationClusterModel, file) {
            var logModels = [];
            _.each(file.jsonObject, function(rec) {
                var model = new RadiationLogModel();
                model.set("date", rec[Code.AUTOMOTIVE_TITLE_TIME]);
                model.set("value", rec[Code.AUTOMOTIVE_TITLE_DOSE1]);
                model.set("latitude", rec[Code.AUTOMOTIVE_TITLE_LATITUDE]);
                model.set("longitude", rec[Code.AUTOMOTIVE_TITLE_LONGITUDE]);
                model.set("altitude", null);
                model.set("collectionId", radiationClusterModel.get("__id"));
                logModels.push(model.getSaveData());
            });
            this.saveEachLogModel(logModels, file);
        },
        /**
         * 線量レコード単位の保存処理
         * @memberOf RadiationRegistView#
         * @param {Array} models radiationLogModelの配列
         */
        saveEachLogModel : function(models, file) {
            var self = this;

            // this.LOG_BULK_COUNT で指定された個数づつ分割し、登録リクエストを発行する
            // 登録はUserScript内で$batchを利用して一括処理される
            var slicedModels = CommonUtil.sliceArray(models, this.LOG_BULK_COUNT);
            var counter = 0;
            async.eachLimit(slicedModels, 1,
            // 各要素に対する保存処理
            function fn(models, done) {
                app.logger.info("Start RadiationRegistView#saveEachLogModel() counter: " + counter);
                var model = new RadiationLogModel();
                model.set("logModels", models);
                model.save(null, {
                    success : function(model, response, options) {
                        this.increaseProgress();
                        //this.showSuccessMessage("放射線ログ情報の保存", null);
                        app.logger.info("Success RadiationRegistView#saveEachLogModel() counter: " + counter++);
                        done();
                    }.bind(this),
                    error : function(model, response, options) {
                        app.logger.info("Error RadiationRegistView#saveEachLogModel() counter: " + counter++);
                        done(response);
                    }
                });
            }.bind(this),
            // 保存処理が全て完了したら呼ばれる
            function onFinish(response) {
                if (response && response.event && response.event.isError()) {
                    this.showErrorMessage(file.name + "(radiation_log)の保存処理", response);
                } else {
                    this.hideLoading();
                    app.router.go("ope-radiation");
                }
            }.bind(this));
        },
    });
    module.exports = RadiationRegistView;
});
