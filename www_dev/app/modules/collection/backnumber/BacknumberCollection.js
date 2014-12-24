define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var moment = require("moment");
    var AbstractCollection = require("modules/collection/AbstractCollection");
    var BacknumberModel = require("modules/model/backnumber/BacknumberModel");
    var DateUtil = require("modules/util/DateUtil");
    var BusinessUtil = require("modules/util/BusinessUtil");

    /**
     * 過去記事情報のコレクションクラス
     * 
     * @class 過去記事情報のコレクションクラス
     * @exports BacknumberCollection
     * @constructor
     */
    var BacknumberCollection = AbstractCollection.extend({
        model : BacknumberModel,

        // ローディング処理中に読み込みが完了したモデル数のカウント用
        numFetchedModels: 0,

        /**
         * 初期化処理
         * @memberof BacknumberCollection#
         */
        initialize : function() {
        },

        /**
         * 対象月を指定する。
         * @param {Date|moment} 対象月をDateオブジェクトで指定。（年月のみ使用）
         * @memberof BacknumberCollection#
         */
        setMonth : function(targetMonth) {
            var self = this;
            
            if (this.month && moment(this.month).isSame(moment(targetMonth))) {
                return;
            }

            this.month = targetMonth;

            // ローディング表示のため、updateModelsの実行を遅延させる
            this.trigger("startLoading");
            setTimeout(function() {
                self.updateModels();
            }, 500);
        },

        /**
         * 月によってmodelを更新する
         * @memberof BacknumberCollection#
         */
        updateModels : function() {
            var month = moment(this.month);
            var startDate = month.clone();
            var endDate = month.clone();
            var d;

            startDate.startOf("month");
            endDate.endOf("month");

            var currentPublishDate = moment(BusinessUtil.getCurrentPublishDate());
            if (DateUtil.formatDate(endDate.toDate(), "yyyy-MM-dd") > DateUtil.formatDate(currentPublishDate.toDate(), "yyyy-MM-dd")) {
                endDate = currentPublishDate.clone();
            }

            d = startDate.clone();

            this.reset();
            this.numFetchedModels = 0;

            do {
                var backnumberModel = new BacknumberModel(null, {
                    date : d.clone()
                });
                this.push(backnumberModel).trigger("add", backnumberModel);
                this.listenTo(backnumberModel, "fetched", this.onModelFeched);

                d.add(1, "day");
            } while (d.isBefore(endDate));

            this.trigger("sync");
        },
        
        /**
         * モデルの読み込みが完了したら呼ばれる
         * @memberof BacknumberCollection#
         */
        onModelFeched: function() {
            this.numFetchedModels++;

            // すべてのモデルが読み込まれたら、ローディング完了イベントを発火する
            if (this.numFetchedModels == this.length) {
                this.trigger("finishLoading");
            }
        }
    });

    module.exports = BacknumberCollection;
});
