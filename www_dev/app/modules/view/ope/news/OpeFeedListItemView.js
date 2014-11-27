define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var FeedListItemView = require("modules/view/news/FeedListItemView");
    var TagListView = require("modules/view/news/TagListView");

    /**
     * 運用管理ツールの記事一覧テーブルの記事レコードのViewを作成する。
     * 
     * @class 運用管理ツールの記事一覧テーブルの記事レコードのView
     * @exports OpeFeedListItemView
     * @constructor
     */
    var OpeFeedListItemView = FeedListItemView.extend({
        /**
         * このViewの親要素
         */
        tagName : "tr",
        /**
         * このViewを表示する際に利用するアニメーション
         */
        animation : null,
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            // タグリストの追加
            this.tagListView = new TagListView();
            this.tagListView.tagsArray = this.model.get("tagsArray");
            this.setView(".articleTags", this.tagListView);
            if (this.model.get("type") === "1") {
                // RSS収集記事は編集ボタンを非表示にする
                this.$el.find("[data-article-edit-button]").hide();
            }
            if (this.model.get("isRecommend")) {
                // 今日のおすすめ記事フラグがある場合はラジオボタンを選択状態にする
                this.$el.find("input[type='radio']").attr("checked","checked");
            }
            this.tagListView.render();
        },
        events : {
            "click [data-article-edit-button]" : "onClickArticleEditButton",
            "change .today-recommend-radio" : "onChangeTodayRecommendRadio"
        },
        /**
         *  編集ボタン押下時に呼び出されるコールバック関数
         */
        onClickArticleEditButton: function () {
            this.showLoading();
            if (this.model.get("type") === "2") {
                app.router.opeYouTubeRegist({
                    model : this.model,
                    recommendArticle : this.parentView.recommendArticle
                });
            } else if (this.model.get("type") === "3" || this.model.get("type") === "4") {
                app.router.opeArticleRegist({
                    model : this.model,
                    recommendArticle : this.parentView.recommendArticle
                });
            }
            $("#contents__primary").scrollTop(0);
        },
        /**
         *  おすすめ記事のラジオボタンが変更された際のコールバック関数
         */
        onChangeTodayRecommendRadio: function () {
            this.showLoading();
            this.model.set("isRecommend","true");
            this.model.save(null,{
                success:$.proxy(this.onRecommendSave,this),
                error:$.proxy(function() {
                    alert("おすすめ記事情報の保存に失敗しました");
                    this.hideLoading();
                },this)
            });
        },
        /**
         * おすすめ記事情報保存後のコールバック関数
         */
        onRecommendSave: function() {
            this.model.fetch({
                success: $.proxy(function() {
                    $(this.el).find("input[type='radio']").trigger("onRecommendFetch",[this.model]);
                },this),
                error:$.proxy(function() {
                    alert("おすすめ記事情報の保存に失敗しました");
                    this.hideLoading();
                },this)
            });
        }

    });

    module.exports = OpeFeedListItemView;
});
