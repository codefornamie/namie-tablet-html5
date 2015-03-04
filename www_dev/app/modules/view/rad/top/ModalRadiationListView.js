define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Code = require("modules/util/Code");
    var HoribaRecordValidator = require("modules/util/HoribaRecordValidator");
    var AbstractView = require("modules/view/AbstractView");
    var ModalRadiationListItemView = require("modules/view/rad/top/ModalRadiationListItemView");
    var CommonUtil = require("modules/util/CommonUtil");
    var RadiationClusterModel = require("modules/model/radiation/RadiationClusterModel");
    var RadiationLogModel = require("modules/model/radiation/RadiationLogModel");
    var vexDialog = require("vexDialog");
    var async = require("async");
    var moment = require("moment");
    require("moment/locale/ja");
    
    /**
     * 線量データのアップロード用リストダイアログクラス
     * @class 線量データのアップロード用リストダイアログクラス
     * @exports ModalRadiationListView
     * @constructor
     */
    var ModalRadiationListView = AbstractView.extend({
        /**
         * テンプレート
         * @memberOf ModalRadiationListView#
         */
        template : require("ldsh!templates/rad/top/modal-radiationList"),

        /**
         * レンダリングに利用するオブジェクトを作成する
         *
         * @memberOf RadPopupView#
         * @return {Object}
         */
        serialize : function () {
            return {
                mode : this.mode
            };
        },

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 線量データ一覧の表示処理を開始する。
         * </p>
         * @memberOf ModalRadiationListView#
         */
        beforeRendered : function() {
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf ModalRadiationListView#
         */
        afterRendered : function() {
            if (this.radiationList) {
                this.radiationList.destroy();
            }
            this.setRadiationList();
            this.hideLoading();

            $(document).trigger("open:modal");
        },
        /**
         * イベント
         * @memberOf ModalRadiationListView#
         */
        events : {
            "click #modal-calendar-overlay" : "onClickOverlay",
            "click [data-close]" : "onClickCloser",
            "click #radiationUploadButton" : "onClickRadiationUploadButton",
            "change #radiation_csv" : "onChangeRadiationCSV"
        },

        /**
         * 初期化処理
         * @memberOf ModalRadiationListView#
         */
        initialize : function (opt) {
            opt = opt || {};

            // ファイル選択形式のモード
            // "list" : HORIBAのディレクトリから自動でリストアップする
            // "form" : HTMLのファイルアップロードのフォームが出る
            this.mode = opt.mode || "list";

            // HORIBAのディレクトリのファイル一覧
            this.fileEntryArray = opt.fileEntryArray;

            if (this.mode === "list") {
                console.assert(
                    this.fileEntryArray,
                    'if modalRadiationListView is "list" mode, it should have fileEntryArray'
                );
            }
        },

        /**
         * 線量データ一覧の表示処理
         * @memberOf ModalRadiationListView#
         */
        setRadiationList : function() {
            _.each(this.fileEntryArray, $.proxy(function(fileEntry) {
                this.insertView("#radiationList", new ModalRadiationListItemView({
                    fileEntry : fileEntry,
                    parentView : this
                })).render();
            }, this));
        },

        /**
         * onChangeRadiationCSV
         * @memberOf ModalRadiationListView#
         */
        onChangeRadiationCSV : function (ev) {
            var files = ev.target.files;
        },

        /**
         * アップロードボタンが押下された際のコールバック関数
         * @memberOf ModalRadiationListView#
         */
        onClickRadiationUploadButton : function() {
            var self = this;
            var fileEntries;

            if (this.mode === "list") {
                // ListItemView取得
                var itemViews = this.getViews("#radiationList") ? this.getViews("#radiationList").value() : [];
                // チェックボックスで選んだItemViewのみに絞る
                var selectedItemViews = itemViews.filter(function(item) {
                    return !!item.$el.find("input:checked").length;
                });

                this.failFileNames = [];

                if (!selectedItemViews) {
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert("アップロードするファイルを選択してください。");
                    return;
                }

                // チェックされたCSVファイルのfileEntryを配列に詰める
                fileEntries = [];
                _.each(selectedItemViews, function(selectItem) {
                    if (selectItem.fileEntry) {
                        fileEntries.push(selectItem.fileEntry);
                    }
                });
            } else if (this.mode === "form") {
                var $fileUploader = $("#radiation_csv");
                fileEntries = $fileUploader[0].files;
            } else {
                throw new Error("Invalid mode of ModalRadiationListView");
            }

            this.showProgressBarLoading();

            this.perProgress = 100 / fileEntries.length / 2;

            // radiationClusterの保存からradiationLogの保存の1セットをシリアルに処理する
            async.eachSeries(fileEntries, function(fileEntry, next) {
                self.convertFileEntry(fileEntry, next);
            }, this.onSaveAll.bind(this));
        },

        /**
         * 全ファイルのアップロードが完了したか、または一部ファイルのアップロードに失敗したら呼ばれる
         * @memberOf ModalRadiationListView#
         * @param {Error} err
         */
        onSaveAll : function (err) {
            this.$progressBar.attr("value", 100);
            this.hideLoading();

            if (err) {
                vexDialog.defaultOptions.className = "vex-theme-default vex-theme-rad";
                vexDialog.alert({
                    message : err
                });
                app.logger.error("ModalRadiationListView#onClickRadiationUploadButton():error:" + err);
                return;
            }

            app.logger.debug("success all to save radiationCluster and radiationLog");
            this.trigger("closeModalRadiationList");
        },

        /**
         * 選択されたファイルをデータとして扱える形に変換する
         * @memberOf ModalRadiationListView#
         * @param {Object} fileEntry FileEntryオブジェクト
         * @param {Function} next
         */
        convertFileEntry : function(fileEntry, next) {
            var readFile = function (file) {
                var reader = new FileReader();

                // fileのロード完了後のコールバック
                reader.onload = function() {
                    var originalRecords;
                    var validator = new HoribaRecordValidator();

                    // 1. CSV形式のデータをJSONオブジェクトに変換
                    try {
                        if (
                            file.type !== "text/csv" &&
                            file.type !== "text/comma-separated-values"
                        ) {
                            throw new Error("couldn't accept file type: " + file.type);
                        }

                        originalRecords = CommonUtil.convertJsonObject(reader.result, {
                            cast : [
                                "String",
                                "Number",
                                "String",
                                "Number"
                            ]
                        });
                    } catch (e) {
                        app.logger.error("CommonUtil.convertJsonObject():error=" + e);
                        next([
                            file.name,
                            " をCSVファイルとして読み込むことができませんでした。",
                            "ファイル形式を再度ご確認下さい。"
                        ].join(""));
                        return;
                    }

                    // 2. 不正なレコードは省く
                    file.jsonObject = validator.validate(originalRecords);

                    // 3. 不正なレコードを省いた旨を通知する
                    vexDialog.defaultOptions.className = "vex-theme-default vex-theme-rad";

                    if (validator.hasError(Code.ERR_NO_RECORD)) {
                        vexDialog.alert({
                            message : [
                                file.name,
                                " は何らかの原因により壊れているため、情報を登録できませんでした。"
                            ].join("")
                        });
                    } else if (validator.hasError(Code.ERR_POSITION_MISSING)) {
                        vexDialog.alert({
                            message : [
                                file.name,
                                " は何らかの原因により壊れているため、一部の情報を登録できませんでした。",
                                "正常な情報については、登録が完了しました。"
                            ].join("")
                        });
                    } else if (validator.hasError(Code.ERR_DOSE_MISSING)) {
                        vexDialog.alert({
                            message : [
                                file.name,
                                " は何らかの原因により壊れているため、一部の情報を登録できませんでした。",
                                "正常な情報については、登録が完了しました。"
                            ].join("")
                        });
                    }

                    // 4. レコードをもとにRadiationClusterModelを作成
                    var radiationClusterModel = this.createRadiationClusterModel(file, validator.errorCode);

                    // 5. Model保存処理
                    this.saveClusterModel(radiationClusterModel, file, next);
                }.bind(this, file);

                // テキストとしてファイルを読み込む
                reader.readAsText(file);
            };

            if (fileEntry instanceof window.File) {
                readFile.call(this, fileEntry);
            } else {
                fileEntry.file(readFile.bind(this), function(err) {
                    // fileでエラー
                    app.logger.error("convertFileEntry(): file(): error" + err.code);
                    next(fileEntry.name + "の読み込みに失敗しました。");
                });
            }
        },
        /**
         * clusterModelにデータをセットする
         * @memberOf ModalRadiationListView#
         * @param {Object} file ファイルオブジェクト
         * @param {Number} errorCode アップロード時のエラーコード
         */
        createRadiationClusterModel : function(file, errorCode) {
            console.assert(typeof errorCode === "number", "errorCode should be a number");

            var radiationClusterModel = new RadiationClusterModel();

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

            return radiationClusterModel;
        },

        /**
         * cluster用のデータを求める
         * @memberOf ModalRadiationListView#
         * @param {Object} file ファイルオブジェクト
         */
        calcDataForCluster : function(file) {
            var data = file.jsonObject;

            // データから時間のみの配列を取得
            var dateTimes = _.map(data, function(obj) {
                return obj[Code.HORIBA_TITLE_DATE];
            });
            file.startDate = _.min(dateTimes, function(date) {
                return new Date(date).getTime();
            });
            file.endDate = _.max(dateTimes, function(date) {
                return new Date(date).getTime();
            });
            file.numSample = data.length;

            // データから線量のみの配列を取得
            var svs = _.map(data, function(obj) {
                return parseFloat(obj[Code.HORIBA_TITLE_DOSE]);
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
                return parseFloat(obj[Code.HORIBA_TITLE_POSITION].split(" ")[0]);
            });
            // データから軽度のみの配列を取得
            var longitudes = _.map(data, function(obj) {
                return parseFloat(obj[Code.HORIBA_TITLE_POSITION].split(" ")[1]);
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
         * @memberOf ModalRadiationListView#
         * @param {Model} radiationClusterModel クラスターモデル
         * @param {Object} file ファイルオブジェクト
         * @param {Function} next
         */
        saveClusterModel : function(radiationClusterModel, file, next) {
            radiationClusterModel.save(null, {
                success : function(model) {
                    this.$progressBar.attr("value", parseInt(this.$progressBar.attr("value")) + this.perProgress);
                    app.logger.debug("saveClusterModel():success");
                    // clusterの保存に成功した場合はradiationLogの保存処理実施
                    this.setLogModels(model, file, next);
                }.bind(this),
                error : function(e) {
                    app.logger.debug("saveClusterModel():error" + e.code);
                    next([
                        file.name,
                        " の保存処理に失敗しました。"
                    ].join(""));
                }
            });
        },
        /**
         * radiationLog作成処理後保存呼び出し
         * @memberOf ModalRadiationListView#
         * @param {Model} radiationClusterModel クラスターモデル
         * @param {Object} file ファイルオブジェクト
         * @param {Function} next
         */
        setLogModels : function(radiationClusterModel, file, next) {
            var logModels = [];
            _.each(file.jsonObject, function(rec) {
                var model = new RadiationLogModel();
                model.set("date", rec[Code.HORIBA_TITLE_DATE]);
                model.set("value", rec[Code.HORIBA_TITLE_DOSE]);
                var position = rec[Code.HORIBA_TITLE_POSITION];
                var latitude = position ? position.split(" ")[0] : null;
                var longitude = position ? position.split(" ")[1] : null;
                model.set("latitude", latitude);
                model.set("longitude", longitude);
                model.set("altitude", rec[Code.HORIBA_TITLE_ALTITUDE]);
                model.set("collectionId", radiationClusterModel.get("__id"));
                logModels.push(model.getSaveData());
            });
            var model = new RadiationLogModel();
            model.set("logModels", logModels);
            model.save(null, {
                success : function() {
                    next();
                },
                error : function(e) {
                    app.logger.error("ModalRadiationListView#saveSequence():error:" + JSON.stringify(e));
                    next(file.name + "の保存処理に失敗しました。");
                }
            });
            
//            this.saveEachLogModel(logModels, file, next);
        },
        /**
         * 線量レコード単位の保存処理
         * @memberOf ModalRadiationListView#
         * @param {Array} models radiationLogModelの配列
         * @param {Function} next
         */
        saveEachLogModel : function(models, file, next) {
            var self = this;

            // TODO 現状は5パラでリクエストしているが後々$batch処理に変更する
            // 最大同時処理数
            var LIMIT_PARALLEL_SAVE_SEQUENCE = 5;

            async.eachLimit(models, LIMIT_PARALLEL_SAVE_SEQUENCE,
            // 各要素に対する保存処理
            function fn(model, done) {
                model.save(null, {
                    success : function() {
                        done();
                    },
                    error : function(e) {
                        done(e);
                    }
                });
            },
            // 保存処理が全て完了したら呼ばれる
            function onFinish(err) {
                if (err) {
                    app.logger.error("ModalRadiationListView#saveSequence():error:" + JSON.stringify(err));
                    next(file.name + "の保存処理に失敗しました。");
                } else {
                    self.$progressBar.attr("value", parseInt(self.$progressBar.attr("value")) + self.perProgress);
                    next();
                }
            });
        },
        /**
         * Viewが破棄される時に呼ばれる
         * @memberOf ModalRadiationListView#
         */
        cleanup : function() {
            if (this.radiationList) {
                this.radiationList.destroy();
            }

            $(document).trigger("close:modal");
        },

        /**
         * オーバレイをクリックした時に呼ばれる
         * @memberOf ModalRadiationListView#
         * @param {Event} ev
         */
        onClickOverlay : function(ev) {
            // オーバーレイの背景部分をタップした場合のみ処理する
            if (!$(ev.target).is("#modal-radiation-overlay")) {
                return;
            }

            this.trigger("closeModalRadiationList");
        },

        /**
         * 閉じるボタンをクリックした時に呼ばれる
         * @memberOf ModalRadiationListView#
         * @param {Event} ev
         */
        onClickCloser : function(ev) {
            this.trigger("closeModalRadiationList");
        }
    });

    module.exports = ModalRadiationListView;
});
