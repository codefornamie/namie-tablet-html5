define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var async = require("async");
    var FeedListView = require("modules/view/news/FeedListView");
    var jquerySortable = require("jquery-sortable");
    var vexDialog = require("vexDialog");

    /**
     * 運用管理ツールの記事一覧テーブルのViewクラスを作成する。
     * @class 運用管理ツールの記事一覧テーブルのView
     * @exports OpeFeedListView
     * @constructor
     */
    var OpeFeedListView = FeedListView.extend({
        events : {
            "click .feedListItem" : "onClickFeedListItem",
            "onRecommendFetch .today-recommend-radio" : "onRecommendFetch"
        },
        /**
         * 記事種別ごとのListItemViewの定義
         * @memberOf OpeFeedListView
         */
        customListItemView: [],
        afterRendered : function() {
            // ドラッグアンドドロップによるテーブルの並び替えを行うための設定
            this.$('.sortable').sortable({
                items : 'tr',
                forcePlaceholderSize : true,
                handle : '.handle'
            }).bind("sortupdate", $.proxy(this.onSortUpdate,this));
            this.recommendArticle = this.collection.find($.proxy(function(model) {
                return model.get("isRecommend");
            }, this));
            $("#sequenceConfirm").hide();
            $("[data-sequence-register-button]").unbind("click");
            $("[data-sequence-register-button]").bind("click", $.proxy(this.onClickSequenceRegist, this));
        },
        /**
         * おすすめ記事登録処理後のコールバック関数処理
         * @memberOf OpeFeedListView#
         * @param {event} フェッチ後イベント
         * @param {ArticleModel} おすすめ情報を保存した記事情報
         */
        onRecommendFetch : function(event, recommendedModel) {
            if (this.recommendArticle) {
                this.recommendArticle.set("isRecommend", null);
                this.recommendArticle.save(null, {
                    success : $.proxy(function() {
                        this.onUnRecommendSave(recommendedModel);
                    }, this),
                    error : $.proxy(function() {
                        alert("おすすめ記事情報の保存に失敗しました");
                        this.hideLoading();
                    }, this)
                });
            } else {
                this.hideLoading();
                this.recommendArticle = recommendedModel;
            }
        },
        /**
         * おすすめ記事削除処理後のコールバック関数処理
         * @memberOf OpeFeedListView#
         * @param {ArticleModel} おすすめ情報を保存した記事情報
         */
        onUnRecommendSave : function(recommendedModel) {
            this.recommendArticle.fetch({
                success : $.proxy(function() {
                    this.hideLoading();
                    this.recommendArticle = recommendedModel;
                }, this)
            });
        },
        /**
         * 並び順設定ボタンが押下された際のコールバック関数
         * @memberOf OpeFeedListView#
         */
        onClickSequenceRegist : function() {
            var self = this;
            // ListItemView取得
            var itemViews = this.getViews("#feedList").value();
            var saveModels = _(itemViews)
                .map(function (itemView) {
                    var remoteSequence = itemView.model.get("sequence");
                    var localSequence = itemView.$el.index().toString();

                    // 並び順に変更がないものは保存対象としない
                    if (remoteSequence !== localSequence) {
                        itemView.model.set("sequence", localSequence);

                        return itemView.model;
                    }
                })
                .compact()
                .value();

            // 保存するmodelが無ければ
            // 何もせず警告を出す
            if (!saveModels || saveModels.length === 0) {
                vexDialog.defaultOptions.className = 'vex-theme-default';
                vexDialog.alert("並び順を変更してから保存ボタンを押してください。");

                return;
            }

            this.showLoading();
            $("#sequenceConfirm").hide();

            this.saveSequence(
                saveModels,

                function onSaveAllSequence(err) {
                    self.hideLoading();

                    if (err && err.httpClient && err.httpClient.status === 412) {
                        //self.collection.fetch();
                        // TODO: NAM-889 collectionの更新処理を行う
                    }
                }
            );
        },

        /**
         * 並び順保存処理
         * @memberOf OpeFeedListView#
         * @param {Array} models 記事情報の配列
         * @param {Function} onSaveAllSequence 情報保存後のコールバック関数
         */
        saveSequence : function(models, onSaveAllSequence) {
            var self = this;
            var isFinished = false;

            // 最大同時処理数
            var LIMIT_PARALLEL_SAVE_SEQUENCE = 5;

            async.eachLimit(
                models,

                LIMIT_PARALLEL_SAVE_SEQUENCE,

                // 各要素に対する保存処理
                function fn(model, onSave) {
                    model
                        .save()
                        .fail(function (err) {
                            // 412 Precondition failed の場合ここに到達する
                            onSave(err);
                        })
                        .done(function () {
                            // ETagを更新する
                            return model.fetch();
                        })
                        .done(function () {
                            onSave();
                        })
                        .fail(function (err) {
                            onSave(err);
                        });
                },

                // 保存処理が全て完了したら呼ばれる
                function onFinish(err) {
                    // 並列リクエストで同時にエラーが返ってくると
                    // onFinishが複数回呼ばれてしまうため、複数呼び出しを防ぐ
                    if (isFinished) {
                        return;
                    }

                    if (err) {
                        vexDialog.defaultOptions.className = 'vex-theme-default';
                        vexDialog.alert("並び順の保存に失敗しました。");
                        app.logger.error("並び順の保存に失敗しました。");
                    }

                    onSaveAllSequence(err);

                    isFinished = true;
                }
            );
        },
        /**
         * @memberOf OpeFeedListView#
         * @param {Event} ev ソートイベント
         * @param {Element} elem 移動した要素
         */
        onSortUpdate : function(ev, elem) {
            var sortArr = [];
            // ListItemView取得
            var itemViews = this.getViews("#feedList").value();
            _.each(itemViews, function(itemView) {
                var sequence = itemView.$el.index().toString();
                if (itemView.model.get("sequence") !== sequence) {
                    sortArr.push(itemView);
                }
            });
            if (sortArr.length > 0) {
                $("#sequenceConfirm").show();
            }
        }
    });

    module.exports = OpeFeedListView;
});
