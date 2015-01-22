define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var moment = require("moment");
    var IsNull = require("modules/util/filter/IsNull");
    var Le = require("modules/util/filter/Le");

    /**
     * 業務ユーティリティクラス
     * @memberOf BusinessUtil#
     */
    var BusinessUtil = function() {

    };

    /**
     * 現在発行中の新聞の日付を返す。
     * @memberOf BusinessUtil#
     * @return {Date} 現在発行中の新聞の日付(最後に新聞を発行した日時)
     * @memberOf BusinessUtil#
     */
    BusinessUtil.getCurrentPublishDate = function() {
        var publishDate = new Date();
        var nowTimeString = moment(publishDate).format("HH:mm");
        if (nowTimeString < app.serverConfig.PUBLISH_TIME) {
            publishDate = moment(publishDate).add(-1, "d");
        }
        return new Date(moment(publishDate).format("YYYY-MM-DD") + "T" + app.serverConfig.PUBLISH_TIME + "+0900");
    };
    /**
     * 休刊日を加味した配信日計算を行う
     * @memberOf BusinessUtil#
     * @param {NewspaperHolidayCollection} newspaperHolidayCollection 
     * @param {Function} callback 休刊日を加味した配信日計算後の処理
     */
    BusinessUtil.calcConsiderSuspendPublication = function(newspaperHolidayCollection, callback) {
        var publishDate = moment();
        var nowTimeString = publishDate.format("HH:mm");
        if (nowTimeString < app.serverConfig.PUBLISH_TIME) {
            publishDate = publishDate.add(-1, "d");
        }
        
        // 休刊日計算処理
        newspaperHolidayCollection.prevPublished(publishDate.toDate(), function(prevPublishDate,isPublish,err) {
            var considerDate = publishDate.format("YYYY-MM-DD");
            if (err) {
                app.logger.error("error BusinessUtil.calcConsiderSuspendPublication()");
            } else if (!isPublish) {
                // 現在の日付が休刊日の場合
                considerDate = moment(prevPublishDate).format("YYYY-MM-DD");
            }
            app.currentPublishDate = moment(publishDate).format("YYYY-MM-DD");
            // 既読管理のためにパーソナル情報を更新。
            app.user.updateShowLastPublished();
            callback(considerDate);
        });
    };

    module.exports = BusinessUtil;
});
