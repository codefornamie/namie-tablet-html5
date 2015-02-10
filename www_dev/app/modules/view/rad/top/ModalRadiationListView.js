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
            var self = this;
            // ListItemView取得
            var itemViews = this.getViews("#radiationList").value();
            // チェックボックスで選んだItemViewのみに絞る
            var selectedItemViews = itemViews.filter(function(item) {
                return !!item.$el.find("input:checked").length;
            });
            
            var fileEntry = selectedItemViews[0].fileEntry;
            
//            this.fileEntries = [];
//            this.count = 0;
//            this.files = [];
//            _.each(selectedItemViews,function(selectItem) {
//                this.fileEntries.push(selectItem.fileEntry);
//            }.bind(this));
            
            fileEntry.file(function(file) {
                var reader = new FileReader();
                // ロード関数登録
                reader.onload = function(e) {
                    console.log("result:"+reader.result);
                    file.jsonObject = CommonUtil.convertJsonObject(reader.result);
                    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa" + JSON.stringify(file.jsonObject));
                    this.saveRadiationCluster(file);
                }.bind(this,file);
                 
                // テキストとしてファイルを読み込む
                reader.readAsText(file);
            }.bind(this), function(e) {
                // fileでエラー
                app.logger.debug("onClickRadiationUploadButton(): file(): error" + e.code);
            }.bind(this));
            
            //            var saveModels = _(itemViews)
//                .map(function (itemView) {
//                    var remoteSequence = itemView.model.get("sequence");
//                    var localSequence = itemView.$el.index().toString();
//
//                    // 並び順に変更がないものは保存対象としない
//                    if (remoteSequence !== localSequence) {
//                        itemView.model.set("sequence", localSequence);
//
//                        return itemView.model;
//                    }
//                })
//                .compact()
//                .value();
//
//            // 保存するmodelが無ければ
//            // 何もせず警告を出す
//            if (!saveModels || saveModels.length === 0) {
//                vexDialog.defaultOptions.className = 'vex-theme-default';
//                vexDialog.alert("並び順を変更してから保存ボタンを押してください。");
//
//                return;
//            }
//
//            this.showLoading();
//            $("#sequenceConfirm").hide();
//
//            this.saveSequence(
//                saveModels,
//
//                function onSaveSequence(err) {
//                    self.hideLoading();
//                }
//            );
        },

//        /**
//         * 選択されたファイルオブジェクトをテキストデータにコンバートしたあとに呼ばれる
//         * @memberOf ModalRadiationListView#
//         */
//        onConvertTextData : function (file) {
//            this.count++;
//            this.files.push(file);
//            if (this.count >= this.fileEntries.length) {
//                this.saveRadiationCluster();
//            }
//        },
        /**
         * Viewが破棄される時に呼ばれる
         * @memberOf ModalRadiationListView#
         */
        saveRadiationCluster : function (file) {
            var radiationClusterModels = [];
            var radiationClusterModel = new RadiationClusterModel();
            this.calcDataForCluster(file);
            radiationClusterModel.set("userId",app.user.get("__id"));
            radiationClusterModel.set("startDate",file.startDate);
            radiationClusterModel.set("endDate",file.endDate);
            radiationClusterModel.set("numSample",file.numSample);
            radiationClusterModel.set("maxValue",file.maxValue);
            radiationClusterModel.set("averageValue",Math.floor(file.averageValue) || null);
            radiationClusterModel.set("maxLatitude",file.maxLatitude || null);
            radiationClusterModel.set("minLatitude",file.minLatitude || null);
            radiationClusterModel.set("minLongitude",file.minLongitude || null);
            radiationClusterModel.set("maxLongitude",file.maxLongitude || null);
            radiationClusterModel.set("isFixedStation",false);
            this.saveClusterModel(radiationClusterModel, file);
            
        },
        
        /**
         * cluster用のデータを求める
         * @memberOf ModalRadiationListView#
         */
        calcDataForCluster : function (file) {
            var data = file.jsonObject;
            var dateTimes = _.map(data,function(obj) {
                return obj["Date/Time"];
            });
            file.startDate = _.min(dateTimes,function(date){
                return new Date(date).getTime();
            });
            file.endDate = _.max(dateTimes,function(date){
                return new Date(date).getTime();
            });
            file.numSample = data.length;
            var svs = _.map(data,function(obj) {
                return obj["Dose equivalent rate (uSv/h)"];
            });
            console.log("svs:" + JSON.stringify(svs));
            file.maxValue = _.max(svs,function(sv){
                return sv;
            }) * 1000;
            file.minValue = _.min(svs,function(sv){
                return sv;
            }) * 1000;
            file.averageValue = _.reduce(svs,function(pre, next){
                return pre + next;
            }) * 1000 / data.length ;
            var latitudes = _.map(data,function(obj) {
                return obj["Position"] ? obj["Position"].split(" ")[0] : [""];
            });
            var longitudes = _.map(data,function(obj) {
                return obj["Position"] ? obj["Position"].split(" ")[1] : [""];
            });
            file.maxLatitude = _.max(latitudes,function(lat){
                return lat;
            }) * 1000000;
            file.minLatitude = _.min(latitudes,function(lat){
                return lat;
            }) * 1000000;
            file.minLongitude = _.max(longitudes,function(lon){
                return lon;
            }) * 1000000;
            file.maxLongitude = _.min(longitudes,function(lon){
                return lon;
            }) * 1000000;
        },
        /**
         * cluster保存処理
         * @memberOf ModalRadiationListView#
         */
        saveClusterModel : function (radiationClusterModel, file) {
            radiationClusterModel.save(null, {
                success : function(model) {
                    this.saveLoopLogModel(model, file);
                }.bind(this),
                error : function(e) {
                  vexDialog.defaultOptions.className = 'vex-theme-default';
                  vexDialog.alert("アップロードに失敗しました。");
                }
            });
        },
        /**
         * radiationLog保存処理
         * @memberOf ModalRadiationListView#
         */
        saveLoopLogModel : function (radiationClusterModel, file) {
            var logModels = [];
            _.each(file.jsonObject,function(rec) {
                var model = new RadiationLogModel();
                model.set("date",rec["Date/Time"]);
                model.set("value",rec["Dose equivalent rate (uSv/h)"]);
                var position = rec["Position"];
                var latitude = position ? position.split(" ")[0] * 1000000 : null;
                var longitude = position ? position.split(" ")[1] * 1000000 : null;
                model.set("altitude",rec["Altitude(m)"] * 1000);
                model.set("collectionId",radiationClusterModel.get("__id"));
                logModels.push(model);
            });
            this.saveSequence(logModels);
        },
        /**
         * 並び順保存処理
         * @memberOf ModalRadiationListView#
         * @param {Array} models 記事情報の配列
         */
        saveSequence : function(models) {
            var self = this;

            // 最大同時処理数
            var LIMIT_PARALLEL_SAVE_SEQUENCE = 5;

            async.eachLimit(
                models,

                LIMIT_PARALLEL_SAVE_SEQUENCE,

                // 各要素に対する保存処理
                function fn(model, done) {
                    model
                        .save()
                        .then(function () {
                            // ETagを更新する
                            return model.fetch();
                        })
                        .done(function () {
                            done();
                        })
                        .fail(function (err) {
                            done(err);
                        });
                },

                // 保存処理が全て完了したら呼ばれる
                function onFinish(err) {
                    if (err) {
                        vexDialog.defaultOptions.className = 'vex-theme-default';
                        vexDialog.alert("アップロードに失敗しました。");
                        app.logger.error("radiationLogModelの保存に失敗しました。");
                    }

//                    onSaveSequence(err);
                }
            );
        },
        /**
         * Viewが破棄される時に呼ばれる
         * @memberOf ModalRadiationListView#
         */
        cleanup : function () {
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
        onClickOverlay : function (ev) {
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
        onClickCloser : function (ev) {
            this.trigger("closeModalRadiationList");
        },
    });

    module.exports = ModalRadiationListView;
});
