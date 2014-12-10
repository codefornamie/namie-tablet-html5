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
         * @memberof OpeFeedListItemView#
         */
        tagName : "tr",
        /**
         * このViewを表示する際に利用するアニメーション
         * @memberof OpeFeedListItemView#
         */
        animation : null,
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberof OpeFeedListItemView#
         * 
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            if (this.model.get("type") === "1") {
                // RSS収集記事は編集ボタンを非表示にする
                this.$el.find("[data-article-edit-button]").hide();
            }
            if (this.model.get("isRecommend")) {
                // 今日のおすすめ記事フラグがある場合はラジオボタンを選択状態にする
                this.$el.find("input[type='radio']").attr("checked","checked");
            }
            this.setData();
        },
        /**
         * このViewのイベントを定義する。
         * @memberof OpeFeedListItemView#
         */
        events : {
            "click [data-article-edit-button]" : "onClickArticleEditButton",
            "change .isPublishCheckBox" : "onChangeIsPublishCheckBox",
            "change .today-recommend-radio" : "onChangeTodayRecommendRadio",
            "click .ope-title-anchor" : "onClickOpeTitleAnchor"
        },
        /**
         * モデルから画面項目への設定。
         * @memberof OpeFeedListItemView#
         */
        setData : function(){
            this.lastModel = this.model;
            this.$el.find(".isPublishCheckBox").prop("checked", !this.model.get("isDepublish"));
        },
        /**
         * 保存の開始
         * @memberof OpeFeedListItemView#
         */
        saveStart : function(){
            this.$el.find(".isPublishCheckBox").prop("disabled", true);
            this.$el.find("[data-article-edit-button]").prop("disabled", true);
        },
        /**
         * 保存の終了
         * @memberof OpeFeedListItemView#
         * @param {Boolean} 保存に成功したかどうか
         */
        saveEnd : function(success){
            if(success){
                this.lastModel = this.model;
            }else{
                this.model = this.lastModel;
            }
            this.setData();
            this.$el.find(".isPublishCheckBox").prop("disabled", false);
            this.$el.find("[data-article-edit-button]").prop("disabled", false);
        },
        /**
         * 配信有無チェックボックスが変更された際のハンドラ
         * @memberof OpeFeedListItemView#
         * @param {Event} イベント
         */
        onChangeIsPublishCheckBox : function(e){
            this.save();
        },
        /**
         * 画面項目からモデルへの設定。
         * @memberof OpeFeedListItemView#
         */
        setInputValue : function(){
            this.model.set("isDepublish", this.$el.find(".isPublishCheckBox").prop('checked') ? null : "true");
        },
        /**
         *  編集ボタン押下時に呼び出されるコールバック関数
         * @memberof OpeFeedListItemView#
         */
        onClickArticleEditButton: function () {
            this.showLoading();
            if (this.model.get("type") === "2") {
                app.router.opeYouTubeRegist({
                    model : this.model,
                    recommendArticle : this.parentView.recommendArticle
                });
            } else {
                app.router.opeArticleRegist({
                    model : this.model,
                    recommendArticle : this.parentView.recommendArticle
                });
            }
            $("#contents__primary").scrollTop(0);
        },
        /**
         *  タイトル押下時に呼び出されるコールバック関数
         * @memberof OpeFeedListItemView#
         */
        onClickOpeTitleAnchor: function () {
            this.showLoading();
            switch (this.model.get("type")) {
            case "1":
                var template = require("ldsh!templates/{mode}/news/articleDetail");

                if (this.model.get("rawHTML")) {
                    template = require("ldsh!templates/{mode}/news/articleDetailForHtml");
                }
                app.router.opeArticleDetail({
                    model : this.model,
                    template : template
                });
                break;
            case "2":
                app.router.opeYouTubeDetail({
                    model : this.model,
                    recommendArticle : this.parentView.recommendArticle
                });
                break;
            case "3":
            case "4":
            case "5":
                app.router.opeEventDetail({
                    model : this.model,
                    recommendArticle : this.parentView.recommendArticle
                });
                break;
            default:
                app.router.opeEventDetail({
                    model : this.model,
                    recommendArticle : this.parentView.recommendArticle
                });
                break;
            }
            $("#contents__primary").scrollTop(0);
        },
        /**
         * 画面データ保存
         * @memberof OpeFeedListItemView#
         */
        save : function(){
            this.setInputValue();
            this.saveStart();
            this.model.save(null, {
                success : $.proxy(function(){
                    this.model.fetch({
                        success : $.proxy(function(){
                            this.saveEnd(true);
                        }, this),
                        error : $.proxy(function(){
                            this.saveEnd();
                        }, this)
                    });
                }, this),
                error : $.proxy(function(){
                    this.saveEnd();
                }, this)
            });
        },
        /**
         *  おすすめ記事のラジオボタンが変更された際のコールバック関数
         * @memberof OpeFeedListItemView#
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
         * @memberof OpeFeedListItemView#
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
