define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var WebDavModel = require("modules/model/WebDavModel");
    var TabletArticleListItemView = require("modules/view/news/ArticleListItemView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var moment = require("moment");
    var vexDialog = require("vexDialog");

    /**
     * 記事一覧アイテムのViewを作成する。
     * 
     * @class 記事一覧アイテムのView
     * @exports LetterListItemView
     * @constructor
     */
    var LetterListItemView = TabletArticleListItemView.extend({
        template : require("ldsh!templates/{mode}/letter/top/letterListItem"),

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         * @memberOf LetterListItemView#
         */
        afterRendered : function() {
            if(this.model.get("imageThumbUrl")){
                var davModel = new WebDavModel();
                var path = this.model.get("imagePath");
                path = path ? path + "/" : "";
                davModel.id = path + this.model.get("imageThumbUrl");
                davModel.fetch({
                    success : $.proxy(function(model, binary) {
                        app.logger.debug("getBinary()");
                        var arrayBufferView = new Uint8Array(binary);
                        var blob = new Blob([
                            arrayBufferView
                        ], {
                            type : "image/jpg"
                        });

                        var url = FileAPIUtil.createObjectURL(blob);
                        var imgElement = this.$el.find(".letterListItemPicture");
                        imgElement.load(function() {
                        });
                        imgElement.attr("src", url);
                    },this),
                    error: $.proxy(function () {
                        app.logger.error("画像の取得に失敗しました");
                    },this)
                });
            }
        },

        /**
         *  イベント一覧
         *  @memberOf LetterListItemView#
         */
        events: {
            "click a[data-delete-letter]" : "onClickDeleteLetter"
        },

        /**
         * aタグがクリックされたら呼ばれる
         * @override
         * @memberOf LetterListItemView#
         */
        onClickAnchorTag: function (e) {
            e.preventDefault();
        },

        /**
         * 削除ボタンがクリックされたら呼ばれる
         * @param {Event} ev
         * @memberOf LetterListItemView#
         */
        onClickDeleteLetter: function (ev) {
            ev.preventDefault();

            vexDialog.defaultOptions.className = 'vex-theme-default vex-theme-letter';
            vexDialog.defaultOptions.contentClassName = 'buttons-left2right';
            vexDialog.buttons.YES.text = 'はい';
            vexDialog.buttons.NO.text = 'いいえ';
            vexDialog.open({
                // TODO: メッセージに削除対象項目のおたより名を反映する
                message : 'この投稿（' + moment(this.publishedAt).format('YYYY年MM月DD日') + '配信）を削除していいですか？',
                callback : $.proxy(function(value) {
                    // TODO: おたよりの削除処理を実装する
                    if (value) {
                        this.showLoading();
                        this.deleteLetter();
                    }
                    return;
                },this)
            });
        },
        /**
         * おたより削除関数
         * @memberOf LetterListItemView#
         */
        deleteLetter: function () {
            this.model.set("isDelete", true);
            this.model.save(null, {
                success : $.proxy(function() {
                    this.hideLoading();
                    this.model.set("isDeleted", true);
                }, this),
                error: function(e){
                    this.hideLoading();
                    vexDialog.alert("削除に失敗しました。");
                    app.logger.error("削除に失敗しました。");
                }
            });
        },
    });
    module.exports = LetterListItemView;
});
