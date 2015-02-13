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
            this.showLoading();
            var self = this;
            // ListItemView取得
            var itemViews = this.getViews("#radiationList").value();
            // チェックボックスで選んだItemViewのみに絞る
            var selectedItemViews = itemViews.filter(function(item) {
                return !!item.$el.find("input:checked").length;
            });

            var fileEntry = selectedItemViews[0].fileEntry;

            // this.fileEntries = [];
            // this.count = 0;
            // this.files = [];
            // _.each(selectedItemViews,function(selectItem) {
            // this.fileEntries.push(selectItem.fileEntry);
            // }.bind(this));

            fileEntry.file(function(file) {
                var reader = new FileReader();
                // ロード関数登録
                reader.onload = function(e) {
                    console.log("result:" + reader.result);
                    file.jsonObject = CommonUtil.convertJsonObject(reader.result);
                    file.jsonObject = _.filter(file.jsonObject, function(json) {
                        return !!json[ModalRadiationListView.HORIBA_TITLE_DOSE] &&
                                !!json[ModalRadiationListView.HORIBA_TITLE_POSITION];
                    });
                    this.setRadiationClusterValue(file);
                }.bind(this, file);

                // テキストとしてファイルを読み込む
                reader.readAsText(file);
            }.bind(this), function(e) {
                // fileでエラー
                app.logger.error("onClickRadiationUploadButton(): file(): error" + e.code);
                this.hideLoading();
                vexDialog.defaultOptions.className = 'vex-theme-default';
                vexDialog.alert("アップロードに失敗しました。");
            }.bind(this));

        },
        /**
         * clusterModelにデータをセットする
         * @memberOf ModalRadiationListView#
         * @param {Object} file ファイルオブジェクト
         */
        setRadiationClusterValue : function(file) {
            var radiationClusterModels = [];
            var radiationClusterModel = new RadiationClusterModel();
            // clustermodelに必要なデータの計算処理を実施
            this.calcDataForCluster(file);
            // modelにデータを詰める
            radiationClusterModel.set("userId", app.user.get("__id"));
            radiationClusterModel.set("startDate", file.startDate);
            radiationClusterModel.set("endDate", file.endDate);
            radiationClusterModel.set("numSample", file.numSample);
            radiationClusterModel.set("maxValue", file.maxValue);
            radiationClusterModel.set("averageValue", file.averageValue);
            radiationClusterModel.set("maxLatitude", file.maxLatitude);
            radiationClusterModel.set("minLatitude", file.minLatitude);
            radiationClusterModel.set("minLongitude", file.minLongitude);
            radiationClusterModel.set("maxLongitude", file.maxLongitude);
            radiationClusterModel.set("isFixedStation", false);
            this.saveClusterModel(radiationClusterModel, file);

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
            console.log("svs:" + JSON.stringify(svs));
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
                if (obj[ModalRadiationListView.HORIBA_TITLE_POSITION]) {
                    return parseFloat(obj[ModalRadiationListView.HORIBA_TITLE_POSITION].split(" ")[0]);
                }
                return [
                    ""
                ];
            });
            // データから軽度のみの配列を取得
            var longitudes = _.map(data, function(obj) {
                if (obj[ModalRadiationListView.HORIBA_TITLE_POSITION]) {
                    return parseFloat(obj[ModalRadiationListView.HORIBA_TITLE_POSITION].split(" ")[1]);
                }
                return [
                    ""
                ];
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
         */
        saveClusterModel : function(radiationClusterModel, file) {
            radiationClusterModel.save(null, {
                success : function(model) {
                    app.logger.debug("saveClusterModel():success");
                    this.saveLoopLogModel(model, file);
                }.bind(this),
                error : function(e) {
                    app.logger.debug("saveClusterModel():error" + e.code);
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert("アップロードに失敗しました。");
                    this.hideLoading();
                }.bind(this)
            });
        },
        /**
         * radiationLog保存処理
         * @memberOf ModalRadiationListView#
         * @param {Model} radiationClusterModel クラスターモデル
         * @param {Object} file ファイルオブジェクト
         */
        saveLoopLogModel : function(radiationClusterModel, file) {
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
            this.saveSequence(logModels);
        },
        /**
         * 線量レコード単位の保存処理
         * @memberOf ModalRadiationListView#
         * @param {Array} models radiationLogModelの配列
         */
        saveSequence : function(models) {
            var self = this;

            // 最大同時処理数
            var LIMIT_PARALLEL_SAVE_SEQUENCE = 5;

            async.eachLimit(models,

            LIMIT_PARALLEL_SAVE_SEQUENCE,

            // 各要素に対する保存処理
            function fn(model, done) {
                model.save().then(function() {
                    // ETagを更新する
                    return model.fetch();
                }).done(function() {
                    done();
                }).fail(function(err) {
                    done(err);
                });
            },

            // 保存処理が全て完了したら呼ばれる
            function onFinish(err) {
                if (err) {
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert("アップロードに失敗しました。");
                    self.hideLoading();
                    app.logger.error("ModalRadiationListView#saveSequence():error:" + JSON.stringify(err));
                    return;
                }
                app.logger.debug("ModalRadiationListView#saveSequence():success");
                self.hideLoading();
                self.trigger("closeModalRadiationList");

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
