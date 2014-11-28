/* global LocalFileSystem */

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var TagListView = require("modules/view/news/TagListView");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var FavoriteModel = require("modules/model/article/FavoriteModel");
    var RecommendModel = require("modules/model/article/RecommendModel");
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
        template : require("ldsh!templates/{mode}/news/articleListItem"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         */
        afterRendered : function() {
            this.showImage();
            this.afterRenderCommon();
            // タグリストの追加
            this.tagListView = new TagListView();
            this.tagListView.tagsArray = this.model.get("tagsArray");
            this.setView(".tagListArea", this.tagListView);
            this.tagListView.render();
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
                articleImage.data("blob", blob);
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
            } else {
                this.$el.find('[data-favorite-delete-button]').hide();
            }
            if (this.model.get("isRecommend")) {
                this.$el.find('[data-recommend-register-button]').hide();
            } else {
                this.$el.find('[data-recommend-delete-button]').hide();
            }
            $(".panzoom-elements").panzoom({
                minScale : 1,
                contain : "invert"
            });

            // 画像クリックイベント
            this.$el.find(".post__body img").on("click", $.proxy(this.onClickImage, this));
        },

        /**
         * このViewのイベントを定義する。
         */
        events : {
            "click [data-favorite-register-button]" : "onClickFavoriteRegisterButton",
            "click [data-favorite-delete-button]" : "onClickFavoriteDeleteButton",
            "click [data-recommend-register-button]" : "onClickRecommendRegisterButton",
            "click [data-recommend-delete-button]" : "onClickRecommendDeleteButton",
            "click #tagAddButton" : "onClickTagAddButton",
            "click .deleteTag" : "onClickDeleteTag",
            "click a" : "onClickAnchorTag"
        },
        /**
         * 切り抜きボタン押下時に呼び出されるコールバック関数。
         */
        onClickFavoriteRegisterButton : function() {
            app.ga.trackEvent("ニュース", "切り抜き登録", this.model.get("title"));

            this.showLoading();
            if (this.model.favorite) {
                this.favoriteModel = this.model.favorite;
            } else {
                this.favoriteModel = new FavoriteModel();
            }
            var source = this.model.get("__id");
            this.favoriteModel.set("source", source);
            this.favoriteModel.set("userId", app.user.get("__id"));
            this.favoriteModel.set("contents", this.model.get("description"));
            this.favoriteModel.set("title", this.model.get("title"));
            this.favoriteModel.set("site", this.model.get("site"));
            this.favoriteModel.set("imageUrl", this.model.get("imageUrl"));
            // TODO 配信日が記事情報に設定されるようになった際には下記を書き換える
            this.favoriteModel.set("publishedAt", new Date().toLocaleDateString());
            this.favoriteModel.set("isDelete",false);
            this.favoriteModel.save(null, {
                success : $.proxy(this.onFavoriteSave, this)
            });
        },
        /**
         * 切り抜き情報保存後に呼び出されるコールバック関数。
         */
        onFavoriteSave : function() {
            this.onChangeStatus("favorite");
            this.favoriteModel.fetch({
                success : $.proxy(function() {
                    this.model.favorite = this.favoriteModel;
                    this.hideLoading();
                }, this),
                error: $.proxy(this.onFailure,this)
            });
        },
        /**
         * 切り抜き削除ボタン押下時に呼び出されるコールバック関数。
         */
        onClickFavoriteDeleteButton : function() {
            app.ga.trackEvent("ニュース", "切り抜き削除", this.model.get("title"));
            // 確認ダイアログを表示
            vexDialog.defaultOptions.className = 'vex-theme-default';
            vexDialog.confirm({
                message: 'この記事を切り抜きから削除しますが、よろしいですか？',
                callback: $.proxy(function(value) {
                    if (value) {
                        this.showLoading();
                        var favoriteModel = this.model.favorite;
                        favoriteModel.set("isDelete", true);
                        favoriteModel.save(null, {
                            success : $.proxy(this.onFavoriteDelete, this),
                            error: $.proxy(this.onFailure,this)
                        });
                    }
                },this)
              });
        },
        /**
         * 切り抜き情報削除後に呼び出されるコールバック関数。
         */
        onFavoriteDelete : function() {
            this.onChangeStatus("favorite");
            this.model.favorite.fetch({
                success : $.proxy(function() {
                    this.hideLoading();
                }, this),
                error: $.proxy(this.onFailure,this)
            });
        },
        /**
         * おすすめボタン押下時に呼び出されるコールバック関数。
         */
        onClickRecommendRegisterButton : function() {
            app.ga.trackEvent("ニュース", "おすすめ登録", this.model.get("title"));
            if (this.model.recommend) {
                this.recommendModel = this.model.recommend;
            } else {
                this.recommendModel = new RecommendModel();
            }
            var source = this.model.get("__id");
            this.recommendModel.set("source", source);
            this.recommendModel.set("userId", app.user.get("__id"));
            this.recommendModel.set("publishedAt", this.model.get("publishedAt"));
            this.recommendModel.set("isDelete", false);
            this.recommendModel.set("etag", "*");
            this.recommendModel.save(null, {
                success : $.proxy(this.onRecommendSave, this),
                error: $.proxy(this.onFailure,this)
            });
        },
        /**
         * おすすめ情報保存後に呼び出されるコールバック関数。
         */
        onRecommendSave : function() {
            this.model.recommend = this.recommendModel;
            this.model.recommendAmount++;
            this.onChangeStatus("recommend");
            this.render();
        },
        /**
         * おすすめ取消押下時に呼び出されるコールバック関数。
         */
        onClickRecommendDeleteButton : function() {
            app.ga.trackEvent("ニュース", "おすすめ削除", this.model.get("title"));
            this.recommendModel = this.model.recommend;
            this.recommendModel.set("isDelete",true);
            this.recommendModel.set("etag", "*");
            this.recommendModel.save(null, {
                success : $.proxy(this.onRecommendDelete, this),
                error: $.proxy(this.onFailure,this)
            });
        },
        /**
         * おすすめ情報削除後に呼び出されるコールバック関数。
         */
        onRecommendDelete : function() {
            this.model.recommend = this.recommendModel;
            this.model.recommendAmount--;
            this.onChangeStatus("recommend");
            this.render();
        },
        /**
         * 情報変更後に呼び出されるコールバック関数。
         * ボタン表示非表示切り替え、および状態の切り替えを行う
         *
         * @params {String} type "favorite" or "recommend"
         */
        onChangeStatus : function(type) {
            if (type === "favorite") {
                this.model.set("isFavorite", !this.model.get("isFavorite"));
            } else {
                this.model.set("isRecommend", !this.model.get("isRecommend"));
            }
            // 対応するボタンの切り替え
            this.$el.find("[data-"+ type +"-register-button]").toggle();
            this.$el.find("[data-"+ type +"-delete-button]").toggle();
        },
        /**
         * タグ追加ボタン押下時に呼び出されるコールバック関数。
         */
        onClickTagAddButton : function() {
            if ($(this.el).find("#tagInput").val()) {
                this.model.get("tagsArray").push($(this.el).find("#tagInput").val());
                this.model.set("tagsArray", _.uniq(this.model.get("tagsArray")));
                $(this.el).find("#tagInput").val("");
                this.model.save(null, {
                    success : $.proxy(this.onSave, this),
                    error: $.proxy(this.onFailure,this)
                });
            }
        },
        /**
         * 記事情報更新完了後に呼び出されるコールバック関数。
         */
        onSave : function() {
            this.model.fetch({
                success : $.proxy(function() {
                    this.tagListView.tagsArray = this.model.get("tagsArray");
                    this.tagListView.render();
                }, this),
                error: $.proxy(this.onFailure,this)
            });
        },
        /**
         *  非同期通信失敗後のコールバック関数
         */
        onFailure: function (err) {
            console.log(err);
            this.hideLoading();
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
            var blob = $(ev.target).data("blob");

            var base = DateUtil.formatDate(new Date(), "yyyy-MM-dd_HH-mm-ss");
            var ext = uri.replace(/.*\//, "").replace(/.*\./, "");
            // TODO blob型の場合、拡張子が取れない
            if (!ext || ext.length > 4) {
                ext = "jpg";
            }
            var fileName = base + "." + ext;
            this.saveImage((blob) ? blob : uri, fileName);
        },
        /**
         * 記事詳細内のアンカータグがクリックされた際のハンドラ
         */
        onClickAnchorTag: function () {
            vexDialog.defaultOptions.className = 'vex-theme-default';
            vexDialog.alert(this.model.get("dispSite") + "のHPを直接開いてリンクを参照してください。");
        },
        /**
         * 指定URiの画像データをストレージに保存する。
         *
         * @param {Object}
         *            data 対象画像のURIまたはBlob
         * @param {String}
         *            filePath 保存先のストレージのパス
         *
         */
        saveImage : function(data, fileName) {
            console.log("scanFile start. filePath: " + fileName);
            if (window.FileTransfer === undefined) {
                alert("ご使用の端末では保存できません。");
                return;
            }
            var sdPath = "/mnt/sdcard/";
            var picturePath = "Pictures/";
            var filePath = sdPath + picturePath + fileName;

            // ファイルシステムエラーハンドラ
            var onFileSystemError = function(e) {
                console.log("FileSystemError: code=" + e.code);
                window.plugins.toast.showLongBottom("画像の保存に失敗しました。");
            };
            // メディアスキャン
            var mediaScan = function(filePath){
                console.log("scanFile start. filePath: " + filePath);
                window.MediaScanPlugin.scanFile(filePath, function(msg) {
                    window.plugins.toast.showLongBottom("画像を保存しました。");
                }, function(err) {
                    window.plugins.toast.showLongBottom("画像の保存に失敗しました。");
                    console.log(err);
                });
            };

            if(data instanceof Blob){
                var blob = data;
                window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 50 * 1024 * 1024, $.proxy(function(fs){
                    fs.root.getFile(picturePath + fileName, {create: true}, $.proxy(function(fileEntry) {
                        fileEntry.createWriter($.proxy(function(fileWriter) {
                            fileWriter.onwriteend = function(e) {
                                mediaScan(filePath);
                            };
                            fileWriter.onerror = function(e) {
                                window.plugins.toast.showLongBottom("画像の保存に失敗しました。");
                                console.log('Write failed: ' + e.toString());
                            };
                            fileWriter.write(blob);

                        }, this), this.onFileSystemError);
                    }, this), this.onFileSystemError);
                }, this), this.onFileSystemError);
            } else {
                var uri = data;
                var fileTransfer = new FileTransfer();
                fileTransfer.download(encodeURI(uri), filePath, function(entry) {
                    mediaScan(filePath);
                }, function(error) {
                    window.plugins.toast.showLongBottom("画像の保存に失敗しました。");
                    console.log("download error source: " + error.source);
                    console.log("download error target: " + error.target);
                    console.log("download error code: " + error.code);
                }, false, {});
            }
        }
    });
    module.exports = ArticleListItemView;
});
