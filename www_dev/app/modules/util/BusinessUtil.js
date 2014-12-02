define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var DateUtil = require("modules/util/DateUtil");
    /**
     * 業務ユーティリティクラス
     */
    var BusinessUtil = function() {

    };

    /**
     * 現在発行中の新聞の日付を返す。
     *
     * @return {Date} 現在発行中の新聞の日付(最後に新聞を発行した日時)
     */
    BusinessUtil.getCurrentPublishDate = function() {
        var publishDate = new Date();
        var nowTimeString = DateUtil.formatDate(publishDate, "HH:mm");
        if(nowTimeString < app.news.publishTime){
            publishDate = DateUtil.addDay(publishDate, -1);
        }
        return new Date(DateUtil.formatDate(publishDate, "yyyy-MM-dd") + "T" + app.news.publishTime + "+0900");
    };

    module.exports = BusinessUtil;
});
