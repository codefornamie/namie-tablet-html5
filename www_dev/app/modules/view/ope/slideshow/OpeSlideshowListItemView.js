define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var vexDialog = require("vexDialog");
    var async = require("async");

    var WebDavModel = require("modules/model/WebDavModel");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * スライドショー画面一覧アイテムのViewクラス
     * @class スライドショー画面一覧アイテムのViewクラス
     * @exports OpeSlideshowListItemView
     * @constructor
     */
    var OpeSlideshowListItemView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/slideshow/slideshowListItem"),
        /**
         * このViewの親要素
         * @memberOf OpeSlideshowListItemView#
         */
        tagName : "tr",
        /**
         * このViewのイベント
         * @memberOf OpeSlideshowListItemView#
         */
        events : {
            "click [data-article-edit-button]" : "onClickSlideshowDeleteButton"
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了前に呼び出される。
         * @memberOf OpeSlideshowListItemView#
         */
        beforeRendered : function() {
        },
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf OpeSlideshowListItemView#
         */
        afterRendered : function() {
            this.showPIOImages(".slideshowImage", [
                {
                    imageUrl : "slideshow/" + this.model.get("filename"),
                    imageIndex : 1
                }
            ]);
        },

        /**
         * 初期化処理
         * @memberOf OpeSlideshowListItemView#
         */
        initialize : function(options) {
        },
        /**
         * スライドショー削除ボタンを押下された際の処理
         * @memberOf OpeSlideshowListItemView#
         */
        onClickSlideshowDeleteButton : function() {
            vexDialog.defaultOptions.className = 'vex-theme-default';
            vexDialog.buttons.YES.text = 'はい';
            vexDialog.buttons.NO.text = 'いいえ';
            vexDialog.open({
                message : 'このスライドショー画像:（' + this.model.get('filename') + ')を削除していいですか？',
                callback : $.proxy(function(value) {
                    if (value) {
                        this.showLoading();
                        this.deleteArticle();
                    }
                    vexDialog.buttons.YES.text = 'OK';
                    return;
                }, this)
            });
        },
        /**
         * スライドショー画像の削除関数
         * WebDavファイルとODataを物理削除する
         * @memberOf OpeSlideshowListItemView#
         */
        deleteArticle : function() {
            var image = this.model.get("filename");
            var davModel = new WebDavModel();
            davModel.set("path", "slideshow");
            davModel.set("fileName", image);
            this.destroyDavFile(davModel);
        },
        /**
         * DAVファイルの削除
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        destroyDavFile : function(davModel) {
            davModel.destroy({
                success : $.proxy(function() {
                    // ODataの削除
                    this.destroyModel();
                }, this),
                error : $.proxy(function(e) {
                    this.hideLoading();
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert("画像削除に失敗しました。");
                    app.logger.error("destroyDavFile():error=" + e.code);
                }, this)
            });
        },
        /**
         * ODataの削除
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        destroyModel : function() {
            // ODataの削除
            this.model.destroy({
                success : $.proxy(function() {
                    app.logger.debug("destroyModel():success");
                }, this),
                error : $.proxy(function(e) {
                    this.hideLoading();
                    vexDialog.alert("削除に失敗しました。");
                    app.logger.error("削除に失敗しました。");
                }, this)
            });
        }
    });
    module.exports = OpeSlideshowListItemView;
});
