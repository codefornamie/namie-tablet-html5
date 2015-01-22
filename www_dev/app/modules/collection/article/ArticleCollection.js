define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var Code = require("modules/util/Code");
    var DateUtil = require("modules/util/DateUtil");
    var Equal = require("modules/util/filter/Equal");
    var Ge = require("modules/util/filter/Ge");
    var Le = require("modules/util/filter/Le");
    var And = require("modules/util/filter/And");
    var Or = require("modules/util/filter/Or");
    var IsNull = require("modules/util/filter/IsNull");

    /**
     * 記事情報のコレクションクラス。
     * 
     * @class 記事情報のコレクションクラス
     * @exports ArticleCollection
     * @constructor
     */
    var ArticleCollection = AbstractODataCollection.extend({
        model : ArticleModel,
        /**
         * 操作対象のEntitySet名
         * @memberOf ArticleCollection#
         */
        entity : "article",
        /**
         * 検索条件
         * @memberOf ArticleCollection#
         */
        condition : {
            // 新聞アプリの記事に表示する最大件数
            top : 300,
            orderby : "createdAt desc"
        },
        /**
         * レスポンス情報のパースを行う。
         * @param {Array} レスポンス情報の配列
         * @param {Object} オプション
         * @memberOf ArticleCollection#
         */
        parseOData : function(response, options) {
            _.each(response, function(res) {
                res.dispCreatedAt = DateUtil.formatDate(new Date(res.createdAt), "yyyy年MM月dd日 HH時mm分");
                res.tagsArray = [];
                res.tagsLabel = "";
                if (res.tags) {
                    var arr = res.tags.split(",");
                    _.each(arr, function(tag) {
                        res.tagsArray.push(decodeURIComponent(tag));
                    });
                }
                // priorityをセットする
                var pr = _.find(app.serverConfig.COLOR_LABEL, function(cl){
                    return cl.type === res.type && cl.site === res.site;
                });
                if(pr){
                    res.priority = pr.priority;
                } else {
                    res.priority = Number.MAX_SAFE_INTEGER;
                }
            });

            if (app.config.basic.mode === Code.APP_MODE_NEWS || app.config.basic.mode === Code.APP_MODE_OPE) {
                // responseをソートする
                // 基本的にsequense順とするが、sequenceが設定されていない(==管理アプリでソート後に追加されたなど)
                // 順序付け(sequence)ありとなしで分ける
                var sequenced = [];
                var unsequenced = [];
                for(var i = 0; i < response.length; i++){
                    if(response.sequense >= "0"){
                        sequenced.push(response[i]);
                    } else {
                        unsequenced.push(response[i]);
                    }
                }
                // 最初に順序付けありのデータをその順序でresponseに設定
                response = _.sortBy(sequenced, function(res) {
                    return parseInt(res.sequence);
                });
                // 順序付けなしは優先度 > 更新日時降順でソート
                unsequenced = _.sortBy(unsequenced, function(res) {
                    return [res.priority, -new Date(res.updatedAt)];
                });
                // 順序付けなしのデータを適切な位置に差し込んでいく
                _.each(unsequenced, function(ures) {
                    // response内でuresの優先度と同じエントリのうち、一番最後に出現するものを探す。
                    var lastIndex = response.length - 1;
                    for(var j = lastIndex; j >= 0; j--){
                        if(ures.priority === response[j]) {
                            lastIndex = j;
                            break;
                        }
                    }
                    // 見つけた要素の後ろ(見つからない場合は最後)に追加する
                    response.splice(lastIndex + 1, 0, ures);
                });
            }

            return response;
        },

        /**
         * 記事の検索条件を指定する。
         * @param {Object} condition 検索条件。現在、targetDateプロパティにDateオブジェクトを指定可能。
         * @memberOf ArticleCollection#
         */
        setSearchCondition : function(condition) {
            var targetDate = condition.targetDate;
            var dateString = DateUtil.formatDate(targetDate, "yyyy-MM-dd");

            this.condition.filters = [
                new And([
                        new Or([
                                new Equal("publishedAt", dateString), new And([
                                        new Le("publishedAt", dateString), new Ge("depublishedAt", dateString)
                                ])
                        ]), new IsNull("isDepublish"), new Or([new IsNull("deletedAt"), new Equal("deletedAt", "")])
                ])
            ];
        }
    });

    module.exports = ArticleCollection;
});
