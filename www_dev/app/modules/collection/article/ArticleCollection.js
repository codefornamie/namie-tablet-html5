/* jshint loopfunc:true */
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
    var moment = require("moment");

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
         * 初期化処理
         * @memberOf ArticleCollection#
         */
        initialize : function() {
            this.condition = {
                top : 300,
                orderby : "createdAt desc"
            };
        },
        /**
         * レスポンス情報のパースを行う。
         * @param {Array} レスポンス情報の配列
         * @param {Object} オプション
         * @memberOf ArticleCollection#
         */
        parseOData : function(response, options) {
            if (app.user.isGuest()) {
                // ゲストユーザの場合には福島民報系記事は表示しない
                var restrictionItems = _.filter(app.serverConfig.COLOR_LABEL, function(item) {
                    return !!item.guestRestriction;
                });
                response = _.filter(response, function(res) {
                    return !_.find(restrictionItems, function(ri) {
                        return ri.site === res.site;
                    });
                });
            }
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
                var pr = _.find(app.serverConfig.COLOR_LABEL, function(cl) {
                    return cl.type === res.type && cl.site === res.site;
                });
                if (pr) {
                    res.priority = pr.priority;
                    res.period = pr.period;
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
                var currentDateString = app.currentDate;

                if (this.searchConditionToDate) {
                    // 休刊日を考慮し、検索条件の最終日を現在閲覧している日付として設定する
                    currentDateString = moment(this.searchConditionToDate).format("YYYY-MM-DD");
                }

                for (var i = 0; i < response.length; i++) {
                    var sequenceArr = [];
                    if (response[i].sequence) {
                        if (!isNaN(parseInt(response[i].sequence))) {
                            // 掲載期間中表示対応前のデータのコンバート
                            var seqObj = {};
                            seqObj[response[i].publishedAt] = response[i].sequence;
                            sequenceArr.push(seqObj);
                        } else if (typeof response[i].sequence === "string") {
                            sequenceArr = JSON.parse(response[i].sequence);
                        } else {
                            // すでにparse処理を一度通っている場合
                            sequenceArr = response[i].sequence;
                        }
                    }
                    response[i].currentSequence = _.find(sequenceArr, function(so) {
                        return !!so[currentDateString];
                    });
                    
                    if (response[i].currentSequence) {
                        response[i].currentSequence = response[i].currentSequence[currentDateString];
                    }
                        
                    if (isNaN(parseInt(response[i].currentSequence))) {
                        unsequenced.push(response[i]);
                    } else {
                        sequenced.push(response[i]);
                    }
                }

                // 最初に順序付けありのデータをその順序でソート
                sequenced = _.sortBy(sequenced, function(res) {
                    return parseInt(res.currentSequence, 10);
                });

                // 次に順序付けなしのデータを優先度 > 更新日時降順でソート
                unsequenced = _.sortBy(unsequenced, function(res) {
                    return [
                        res.priority,
                        - new Date(res.updatedAt)
                    ];
                });

                // 順序付けなしのデータを適切な位置に差し込んでいく
                _.each(unsequenced, function(ures) {
                    // sequenced内でuresの優先度と同じエントリのうち、一番最後に出現するものを探す。
                    var lastIndex = sequenced.length - 1;

                    for (var j = lastIndex; j >= 0; j--) {
                        if (ures.priority === sequenced[j].priority) {
                            lastIndex = j;
                            break;
                        }
                    }

                    // 見つけた要素の後ろ(見つからない場合は最後)に追加する
                    sequenced.splice(lastIndex + 1, 0, ures);
                });

                response = sequenced;
            }

            return response;
        },

        /**
         * 記事の検索条件を指定する。
         * @param {Date} fDate 検索範囲開始日
         * @param {Date} tDate 検索範囲終了日
         * @param {boolean} isOnlyPublish trueの場合、記事の掲載期間を考慮して検索する。
         * falseの場合、記事の掲載開始日のみに基づく。
         * @param {boolean} isDepublish trueの場合、検索結果に掲載中止を含める。
         */
        setSearchConditionRange : function(fDate, tDate, isOnlyPublish, isDepublish) {
            this.searchConditionToDate = tDate;
            var f = moment(fDate).format("YYYY-MM-DD");
            var t = moment(tDate).format("YYYY-MM-DD");

            // 範囲の条件生成
            var rangeCondition;
            if (isOnlyPublish) {
                rangeCondition = new And([new Ge("publishedAt", f), new Le("publishedAt", t)]);
            } else {
                rangeCondition = new And([
                    new Or([
                            new And([
                                    new Le("publishedAt", t), new Ge("depublishedAt", f)
                            ]), new And([
                                    new Or([
                                            new IsNull("depublishedAt"), new Equal("depublishedAt", "")
                                    ]), new Ge("publishedAt", f), new Le("publishedAt", t)
                            ])

                    ])
                ]);
                
            }
            // 全体条件
            var condition = [];
            // 範囲
            condition.push(rangeCondition);
            // 削除を除く
            condition.push(new And([
                new Or([
                        new IsNull("deletedAt"), new Equal("deletedAt", "")
                ])
            ]));
            
            if(!isDepublish){
                // 掲載中止を 除く
                condition.push(new IsNull("isDepublish"));
            }
            
            // 条件を設定する
            this.condition.filters = [
                new And([
                        condition
                ])
            ];
        },
        /**
         * 記事の検索条件を指定する。
         * @param {Object} condition 検索条件。現在、targetDateプロパティにDateオブジェクトを指定可能。
         * @memberOf ArticleCollection#
         */
        setSearchCondition : function(condition) {
            this.setSearchConditionRange(condition.targetDate, condition.targetDate);
        }
    });

    module.exports = ArticleCollection;
});
