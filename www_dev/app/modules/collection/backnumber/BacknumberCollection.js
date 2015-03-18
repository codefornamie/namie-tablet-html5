/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
         * 対象月を指定する。
         * @param {Date|moment} 対象月をDateオブジェクトで指定。（年月のみ使用）
         * @memberOf BacknumberCollection#
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
         * @memberOf BacknumberCollection#
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
         * @memberOf BacknumberCollection#
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
