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
    var Code = require("modules/util/Code");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var NewspaperHolidayModel = require("modules/model/misc/NewspaperHolidayModel");
    var Le = require("modules/util/filter/Le");
    var Ge = require("modules/util/filter/Ge");

    /**
     * 休刊日情報のコレクションクラス
     * 
     * @class 休刊日情報のコレクションクラス
     * @exports NewspaperHolidayCollection
     * @constructor
     */
    var NewspaperHolidayCollection = AbstractODataCollection.extend({
        model : NewspaperHolidayModel,
        /**
         * 操作対象のEntitySet名
         * @memberOf NewspaperHolidayCollection#
         */
        entity : "newspaper_holiday",
        /**
          * 初期化処理
          * @memberOf AchievementCollection#
          */
         initialize : function() {
             this.condition = {
                     top : Code.LIMIT_CONSECUTIVE_HOLIDAY,
                     orderby : "__id desc"
             };
         },
        /**
         * レスポンス情報のパースを行う。
         * @param {Array} レスポンス情報の配列
         * @param {Object} オプション
         * @memberOf NewspaperHolidayCollection#
         */
        parseOData : function(response, options) {
            return response;
        },
        /**
         * 指定した日から遡って、直近の発刊日を返す。
         * @param {Date} d 日付
         * @returns {Function} コールバック
         * function(prevDate, isPublish, err)
         *   {Date} prevDate 指定した日付から遡った直近の発刊日
         *   {Boolean} isHoliday 指定した日付が休刊日かどうか
         *   {Object} err エラーが発生した場合、その原因
         * @memberOf NewspaperHolidayCollection#
         */
        prevPublished : function(d, callback) {
            var md = moment(d);
            this.condition.filters = [
                                      new Le("__id", md.format("YYYY-MM-DD"))
                                      ];
            this.fetch({
                success : function(col, models) {
                    var map = col.indexBy("__id");
                    var isPublish = !map[md.format("YYYY-MM-DD")];
                    for(var i = 1; i < Code.LIMIT_CONSECUTIVE_HOLIDAY; i++){
                        md.add(-1, "d");
                        if(!map[md.format("YYYY-MM-DD")]) {
                            callback(md.toDate(), isPublish, null);
                            return;
                        }
                    }
                    // 休刊日の連続が限界を超えている。
                    callback(null, false, new Error());
                },
                error : function(model, response, options) {
                    callback(null, false, response);
                },
            });
        },
        /**
         * 指定した日から直近の次号発刊日を返す。
         * @param {Date} d 日付
         * @returns {Function} コールバック
         * function(prevDate, isPublish, err)
         *   {Date} prevDate 指定した日付の直近の発刊日
         *   {Object} err エラーが発生した場合、その原因
         * @memberOf NewspaperHolidayCollection#
         */
        nextPublish : function(d, callback) {
            var md = moment(d);
            this.condition.filters = [
                                      new Ge("__id", md.format("YYYY-MM-DD"))
                                      ];
            this.condition.orderby = "__id";
            this.fetch({
                success : function(col, models) {
                    var map = col.indexBy("__id");
                    for(var i = 0; i < Code.LIMIT_CONSECUTIVE_HOLIDAY; i++){
                        if(!map[md.format("YYYY-MM-DD")]) {
                            callback(md.toDate(), null);
                            return;
                        }
                        md.add(1, "d");
                    }
                    // 休刊日の連続が限界を超えている。
                    callback(null, new Error());
                },
                error : function(e) {
                    callback(null, e);
                },
            });
        }
    });

    module.exports = NewspaperHolidayCollection;
});
