define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var moment = require("moment");
    var AbstractCollection = require("modules/collection/AbstractCollection");
    var BacknumberModel = require("modules/model/backnumber/BacknumberModel");

    /**
     * 記事情報のコレクションクラス
     * 
     * @class
     * @exports BacknumberCollection
     * @constructor
     */
    var BacknumberCollection = AbstractCollection.extend({
        model : BacknumberModel,

        /**
         * 初期化処理
         */
        initialize : function() {
            // [TODO]
            // ダミーデータを5件入れているので
            // 正式なデータ取得処理に置き換えるべき
            // for (var i = 0; i < 5; i++) {
            // this.push(new BacknumberModel());
            // }
        },

        /**
         * 対象月を指定する。
         * @param {Date|moment} 対象月をDateオブジェクトで指定。（年月のみ使用）
         */
        setMonth : function(targetMonth) {
            if (this.month && moment(this.month).isSame(moment(targetMonth))) {
                return;
            }

            this.month = targetMonth;

            this.reset();
            this.updateModels();
        },

        /**
         * 月によってmodelを更新する
         */
        updateModels : function() {
            // TODO 過去の月は1~31日まで出すけど、今月は1日~今日まで出す
            var month = moment(this.month);
            var startDate = month.clone();
            var endDate = month.clone();
            var d;

            startDate.startOf("month");
            endDate.endOf("month");

            d = startDate.clone();

            do {
                var backnumberModel = new BacknumberModel(null, {
                    date : d.clone()
                });
                this.push(backnumberModel).trigger("add", backnumberModel);

                d.add(1, "day");
            } while (d.isBefore(endDate));

            this.trigger("sync");
        }
    });

    module.exports = BacknumberCollection;
});
