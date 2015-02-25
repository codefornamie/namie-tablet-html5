define(function(require, exports, module) {
    "use strict";

    var app = require("app");
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
            "click #radiationUploadButton" : "onClickRadiationUploadButton"
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
         * アップロードボタンが押下された際のコールバック関数
         * @memberOf ModalRadiationListView#
         */
        onClickRadiationUploadButton : function() {
            var self = this;
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
            this.showProgressBarLoading();

            // チェックされたCSVファイルのfileEntryを配列に詰める
            var fileEntries = [];
            _.each(selectedItemViews, function(selectItem) {
                if (selectItem.fileEntry) {
                    fileEntries.push(selectItem.fileEntry);
                }
            });
            this.parProgress = 100 / fileEntries.length / 2;
            // radiationClusterの保存からradiationLogの保存の1セットをシリアルに処理する
            async.eachSeries(fileEntries, function(fileEntry, next) {
                self.convertFileEntry(fileEntry, next);
            }, function complete(err) {
                self.$progressBar.attr("value", 100);
                self.hideLoading();
                if (err) {
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert(err);
                    app.logger.error("ModalRadiationListView#onClickRadiationUploadButton():error:" + err);
                    return;
                }
                app.logger.debug("success all to save radiationCluster and radiationLog");
                self.trigger("closeModalRadiationList");
            });
        },
        /**
         * 選択されたファイルをデータとして扱える形に変換する
         * @memberOf ModalRadiationListView#
         * @param {Object} fileEntry FileEntryオブジェクト
         * @param {Function} next
         */
        convertFileEntry : function(fileEntry, next) {
            fileEntry.file(function(file) {
                var reader = new FileReader();
                // fileのロード完了後のコールバック
                reader.onload = function(ev) {
                    try {
                        // テキスト形式で返却されたデータをjsonオブジェクトに変換
                        file.jsonObject = CommonUtil.convertJsonObject(reader.result);
                    } catch (e) {
                        app.logger.error("CommonUtil.convertJsonObject():error=" + e);
                        next(file.name + "の形式が正しくありません。");
                        return;
                    }
                    // 線量値や緯度経度情報が無いレコードは省く
                    file.jsonObject = _.filter(file.jsonObject, function(json) {
                        return !!json[ModalRadiationListView.HORIBA_TITLE_DOSE] &&
                                !!json[ModalRadiationListView.HORIBA_TITLE_POSITION];
                    });
                    // データからcluster保存用のモデル作成
                    var radiationClusterModel = this.createRadiationClusterModel(file);
                    // 保存処理
                    this.saveClusterModel(radiationClusterModel, file, next);
                }.bind(this, file);

                // テキストとしてファイルを読み込む
                reader.readAsText(file);
            }.bind(this), function(err) {
                // fileでエラー
                app.logger.error("convertFileEntry(): file(): error" + err.code);
                next(fileEntry.name + "の読み込みに失敗しました。");
            });
        },
        /**
         * clusterModelにデータをセットする
         * @memberOf ModalRadiationListView#
         * @param {Object} file ファイルオブジェクト
         */
        createRadiationClusterModel : function(file) {
            var radiationClusterModels = [];
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
            radiationClusterModel.set("averageValue", file.averageValue);
            radiationClusterModel.set("maxLatitude", file.maxLatitude);
            radiationClusterModel.set("minLatitude", file.minLatitude);
            radiationClusterModel.set("minLongitude", file.minLongitude);
            radiationClusterModel.set("maxLongitude", file.maxLongitude);
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
                return obj[ModalRadiationListView.HORIBA_TITLE_DATE];
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
                return parseFloat(obj[ModalRadiationListView.HORIBA_TITLE_DOSE]);
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
                return parseFloat(obj[ModalRadiationListView.HORIBA_TITLE_POSITION].split(" ")[0]);
            });
            // データから軽度のみの配列を取得
            var longitudes = _.map(data, function(obj) {
                return parseFloat(obj[ModalRadiationListView.HORIBA_TITLE_POSITION].split(" ")[1]);
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
                    this.$progressBar.attr("value", parseInt(this.$progressBar.attr("value")) + this.parProgress);
                    app.logger.debug("saveClusterModel():success");
                    // clusterの保存に成功した場合はradiationLogの保存処理実施
                    this.setLogModels(model, file, next);
                }.bind(this),
                error : function(e) {
                    app.logger.debug("saveClusterModel():error" + e.code);
                    next(file.name + "の保存処理に失敗しました。");
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
                model.set("date", rec[ModalRadiationListView.HORIBA_TITLE_DATE]);
                model.set("value", rec[ModalRadiationListView.HORIBA_TITLE_DOSE]);
                var position = rec[ModalRadiationListView.HORIBA_TITLE_POSITION];
                var latitude = position ? position.split(" ")[0] : null;
                var longitude = position ? position.split(" ")[1] : null;
                model.set("latitude", latitude);
                model.set("longitude", longitude);
                model.set("altitude", rec[ModalRadiationListView.HORIBA_TITLE_ALTITUDE]);
                model.set("collectionId", radiationClusterModel.get("__id"));
                logModels.push(model);
            });
            this.saveEachLogModel(logModels, file, next);
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
                    self.$progressBar.attr("value", parseInt(self.$progressBar.attr("value")) + self.parProgress);
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
    }, {
        /**
         * HORIBAcsvの収集時刻ヘッダ名
         */
        HORIBA_TITLE_DATE : "Date/Time",
        /**
         * HORIBAcsvの線量ヘッダ名
         */
        HORIBA_TITLE_DOSE : "Dose equivalent rate (uSv/h)",
        /**
         * HORIBAcsvの緯度経度ヘッダ名
         */
        HORIBA_TITLE_POSITION : "Position",
        /**
         * HORIBAcsvの高度ヘッダ名
         */
        HORIBA_TITLE_ALTITUDE : "Altitude(m)"

    });

    module.exports = ModalRadiationListView;
});
