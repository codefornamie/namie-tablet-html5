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
     * @param {ArticleCollection} articleCollection 記事情報コレクション：インポートしてしまうとループが発生してしまうため、 引数でインスタンスをもらう
     * @param {Function} callback 休刊日を加味した配信日計算後の処理
     */
    BusinessUtil.calcConsiderSuspendPublication = function(articleCollection, callback) {
        var publishDate = new Date();
        var nowTimeString = moment(publishDate).format("HH:mm");
        if (nowTimeString < app.serverConfig.PUBLISH_TIME) {
            publishDate = moment(publishDate).add(-1, "d");
        }

        // 休刊対応の場合は、直近の配信日を知るため、publishedAtでorderbyし、先頭一件取得を行う
        articleCollection.condition = {
            top : 1,
            orderby : "publishedAt desc"
        };
        articleCollection.condition.filters = [
                new Le("publishedAt", moment(publishDate).format("YYYY-MM-DD")), new IsNull("isDepublish")
        ];
        articleCollection.fetch({
            success : $.proxy(function() {
                if (articleCollection.size()) {
                    // 検索結果が得られた場合は、そのarticle情報のpublishedAtを本日の配信日とする
                    publishDate = articleCollection.at(0).get("publishedAt");
                }
                app.currentPublishDate = moment(publishDate).format("YYYY-MM-DD");
                // 既読管理のためにパーソナル情報を更新。
                app.user.updateShowLastPublished();
                callback(app.currentPublishDate);
            }, this),
            error : $.proxy(function() {
                callback(app.currentPublishDate);
            }, this),
        });
    };

    module.exports = BusinessUtil;
});
