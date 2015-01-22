define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var moment = require("moment");
    var Code = require("modules/util/Code");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var NewspaperHolidayModel = require("modules/model/misc/NewspaperHolidayModel");
    var Le = require("modules/util/filter/Le");

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
         * 検索条件
         * @memberOf NewspaperHolidayCollection#
         */
        condition : {
            top : Code.LIMIT_CONSECUTIVE_HOLIDAY,
            orderby : "__id desc"
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
                        var map = col.indexBy("__id");
                        if(!map[md.format("YYYY-MM-DD")]) {
                            callback(md.toDate(), isPublish, null);
                            return;
                        }
                    }
                    callback(null, false, new Error()); // 廃刊
                },
                error : function(e) {
                    callback(null, false, e);
                },
            })
        }
    });

    module.exports = NewspaperHolidayCollection;
});
