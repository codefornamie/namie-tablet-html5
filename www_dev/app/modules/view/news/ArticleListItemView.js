define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var FavoriteModel = require("modules/model/article/FavoriteModel");
    var CommonUtil = require("modules/util/CommonUtil");
    var DateUtil = require("modules/util/DateUtil");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var vexDialog = require("vexDialog");

    /**
     * 記事一覧アイテムのViewを作成する。
     * 
     * @class 記事一覧アイテムのView
     * @exports ArticleListItemView
     * @constructor
     */
    var ArticleListItemView = AbstractView.extend({
        /**
         * このViewを表示する際に利用するアニメーション
         */
        template : require("ldsh!/app/templates/news/articleListItem"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            this.showImage();
            this.afterRenderCommon();
        },
        /**
         * このViewが表示している記事に関連する画像データの取得と表示を行う。
         */
        showImage : function() {
            var articleImage = $(this.el).find(".articleDetailImage");
            var onGetBinary = function(binary) {
                var arrayBufferView = new Uint8Array(binary);
                var blob = new Blob([ arrayBufferView ], {
                    type : "image/jpg"
                });
                var url = FileAPIUtil.createObjectURL(blob);
                articleImage.load(function() {
                    articleImage.parent().show();
                    window.URL.revokeObjectURL(articleImage.attr("src"));
                });
                articleImage.attr("src", url);
            };

            if (this.model.get("imageUrl")) {
                articleImage.attr("src", this.model.get("imageUrl"));
            } else if (this.model.get("fileName")) {
                try {
                    app.box.col("dav").getBinary(this.model.get("fileName"), {
                        success : onGetBinary
                    });
                } catch (e) {
                    console.error(e);
                }
                // iscroll.jsが正確に高さを把握できなくなるため,
                // 後から画像が読み込まれる場合はhideしない
                //articleImage.parent().hide();
            } else {
                // ArticleListViewでiscrollを初期化する際に
                // 記事内のimgの読み込みを待機しているので
                // このimgは決して読み込まれないことを通知する
                articleImage.trigger('error', "this image will never be loaded");
                $(this.el).find(".articleDetailImageArea").hide();
            }

            if (this.model.get("imageUrl")) {
                $(this.el).find("#nehan-articleDetailImage").parent().css("width", "auto");
                $(this.el).find("#nehan-articleDetailImage").parent().css("height", "auto");
                $(this.el).find("#nehan-articleDetailImage").css("width", "auto");
                $(this.el).find("#nehan-articleDetailImage").css("height", "auto");
            }
        },
        /**
         * Viewの秒が処理の後の、記事表示処理で共通する処理を行う。
         * <p>
         * 以下の処理を行う。
         * <ul>
         * <li>お気に入りボタンの表示・非表示判定</li>
         * <li>タグの表示</li>
         * <li>画像クリックイベントのバインド<br/> 画像クリック時に、対象画像の保存処理を行うためのイベントをバインドする。 </li>
         * </p>
         * 
         */
        afterRenderCommon : function() {
            // 既にお気に入り登録されている記事のお気に入りボタンを非表示にする
            if (this.model.get("isFavorite")) {
                this.$el.find('[data-favorite-register-button]').hide();
            }
            $(".panzoom-elements").panzoom({
                minScale : 1,
                contain : "invert"
            });

            // タグボタンの追加
            // beforeRenderで実施すると要素がなくタグが挿入できなかったためここで実装
            if (this.model.get("tagsArray").length) {
                _.each(this.model.get("tagsArray"), $.proxy(function(tag) {
                    var tagLabel = CommonUtil.sanitizing(tag);
                    $(this.el).find(".tagButtons").append("<button type='button' class='tiny button secondary deleteTag'>" + tagLabel + "</button>");
                }, this));
            }
            if (this.model.get("isNotArticle")) {
                $(this.el).find(".tagInputArea").hide();
            }

            // 画像クリックイベント
            this.$el.find("#articleDetailImageArea").on("click", $.proxy(this.onClickImage, this));
        },

        /**
         * このViewのイベントを定義する。
         */
        events : {
            "click [data-favorite-register-button]" : "onClickFavoriteRegisterButton",
            "click #tagAddButton" : "onClickTagAddButton",
            "click .deleteTag" : "onClickDeleteTag",
            "click a" : "onClickAnchorTag"
        },
        /**
         * お気に入りボタン押下時に呼び出されるコールバック関数。
         */
        onClickFavoriteRegisterButton : function() {
            var favoriteModel = new FavoriteModel();
            var source = this.model.get("__id");
            if (this.model.get("url")) {
                source = this.model.get("url");
            }
            favoriteModel.set("source", source);
            favoriteModel.set("userId", "namie");
            favoriteModel.set("contents", this.model.get("description"));
            favoriteModel.set("title", this.model.get("title"));
            favoriteModel.set("createdAt", new Date().toISOString());
            favoriteModel.save(null, {
                success : $.proxy(function() {
                    this.$el.find("[data-favorite-register-button]").hide();
                    this.model.set("isFavorite", true);
                }, this)
            });
        },
        /**
         * タグ追加ボタン押下時に呼び出されるコールバック関数。
         */
        onClickTagAddButton : function() {
            if ($(this.el).find("#tagInput").val()) {
                this.model.get("tagsArray").push($(this.el).find("#tagInput").val());
                this.model.set("tagsArray", _.uniq(this.model.get("tagsArray")));
                this.model.save(null, {
                    success : $.proxy(this.onSave, this)
                });
            }
        },
        /**
         * 記事情報更新完了後に呼び出されるコールバック関数。
         */
        onSave : function() {
            this.model.fetch({
                success : $.proxy(function() {
                    this.render();
                }, this)
            });
        },
        /**
         * タグボタン押下時に呼び出されるコールバック関数。
         * 
         * @params {event} タグボタンのクリックイベント
         */
        onClickDeleteTag : function(ev) {
            if (!this.model.get("isNotArticle")) {
                var tagLabel = $(ev.currentTarget).text();
                this.model.set("tagsArray", _.without(this.model.get("tagsArray"), tagLabel));
                this.model.save(null, {
                    success : $.proxy(this.onSave, this)
                });
            }
        },
        /**
         * 画像をクリックされた際に呼び出されるコールバック関数。
         * <p>
         * 指定された画像をギャラリーに保存する。
         * </p>
         */
        onClickImage : function(ev) {
            var uri = ev.target.src;
            var base = DateUtil.formatDate(new Date(), "yyyy-MM-dd_HH-mm-ss");
            var ext = uri.replace(/.*\//, "").replace(/.*\./, "");
            if (!ext) {
                ext = "jpg";
            }
            var fileName = this.getLocalPath() + "/" + base + "." + ext;
            this.saveImage(uri, fileName);
        },
        /**
         * 記事詳細内のアンカータグがクリックされた際のハンドラ
         */
        onClickAnchorTag: function () {
            vexDialog.defaultOptions.className = 'vex-theme-default';
            vexDialog.alert(this.model.get("dispSite") + "のHPを直接開いてリンクを参照してください。");
        },
        /**
         * アプリから保存可能なローカルストレージのパスを取得する。
         * 
         * @return {String} ローカルストレージのパス
         */
        getLocalPath : function() {
            return "/mnt/sdcard/Pictures/namie-town";
        },
        /**
         * 指定URiの画像データをストレージに保存する。
         * 
         * @param {String}
         *            uri 対象画像のURI
         * @param {String}
         *            filePath 保存先のストレージのパス
         * 
         */
        saveImage : function(uri, filePath) {
            if (window.FileTransfer === undefined) {
                alert("ご使用の端末では保存できません。");
                return;
            }
            var fileTransfer = new FileTransfer();
            fileTransfer.download(encodeURI(uri), filePath, function(entry) {
                window.MediaScanPlugin.scanFile(filePath, function(msg) {
                    window.plugins.toast.showLongBottom("画像を保存しました。");
                }, function(err) {
                    window.plugins.toast.showLongBottom("画像の保存に失敗しました。");
                    console.log(err);
                });
            }, function(error) {
                window.plugins.toast.showLongBottom("画像の保存に失敗しました。");
                console.log("download error source: " + error.source);
                console.log("download error target: " + error.target);
                console.log("download error code: " + error.code);
            }, false, {});
        }
    });
    module.exports = ArticleListItemView;
});
