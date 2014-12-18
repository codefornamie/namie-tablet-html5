define(function(require, exports, module) {
    "use strict";

    var app = require("app");
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
        afterRendered : function() {
            // ドラッグアンドドロップによるテーブルの並び替えを行うための設定
            this.$('.sortable').sortable({
                items : 'tr',
                forcePlaceholderSize : true,
                handle : '.handle'
            });
            this.recommendArticle = this.collection.find($.proxy(function(model) {
                return model.get("isRecommend");
            }, this));
            $("[data-sequence-register-button]").show();
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
            this.showLoading();
            var saveModels = [];
            // ListItemView取得
            var itemViews = this.getViews("#feedList").value();
            _.each(itemViews, function(itemView) {
                var sequence = itemView.$el.index().toString();
                if (itemView.model.get("sequence") !== sequence) {
                    // 並び順に変更がないものは保存対象としない
                    itemView.model.set("sequence", itemView.$el.index().toString());
                    saveModels.push(itemView.model);
                }
            });
            var onSaveFunction = $.proxy(function() {
                if (saveModels.length <= 0) {
                    // 並び順が代わっていないようなら処理を行わない
                    this.hideLoading();
                } else {
                    // リクエスト過多にならないように、最大５パラで保存処理を実行する
                    this.saveSequence(saveModels.splice(0, 5), onSaveFunction);
                }
            }, this);
            this.saveSequence(saveModels.splice(0, 5), onSaveFunction);
        },
        /**
         * 並び順保存処理
         * @memberOf OpeFeedListView#
         * @param {Array} models 記事情報の配列
         * @param {Function} callback 情報保存後のコールバック関数
         */
        saveSequence : function(models, callback) {
            if (!models || models.length === 0) {
                vexDialog.defaultOptions.className = 'vex-theme-default';
                vexDialog.alert("並び順を変更してから保存ボタンを押してください。");
                this.hideLoading();
                return;
            }
            var modelsLength = models.length;
            var currentCount = 0;

            _.each(models, $.proxy(function(model) {
                model.save(null, {
                    success : $.proxy(function() {
                        currentCount++;
                        if (currentCount >= modelsLength) {
                            // 全ての保存処理が終わったタイミングでコールバックを呼ぶ
                            callback();
                        }
                    }, this),
                    error : $.proxy(function() {
                        this.hideLoading();
                        vexDialog.defaultOptions.className = 'vex-theme-default';
                        vexDialog.alert("並び順の保存に失敗しました。");
                        app.logger.error("並び順の保存に失敗しました。");
                    }, this)
                });
            }, this));
        }
    });

    module.exports = OpeFeedListView;
});
