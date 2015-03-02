define(function(require, exports, module) {

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var WebDavModel = require("modules/model/WebDavModel");

    var ArticleRegistView = require("modules/view/posting/news/ArticleRegistView");
    var DateUtil = require("modules/util/DateUtil");
    var CommonUtil = require("modules/util/CommonUtil");
    var vexDialog = require("vexDialog");
    var async = require("async");

    /**
     * スライドショー画像登録確認画面のViewクラス
     * 
     * @class スライドショー画像登録確認画面のViewクラス
     * @exports OpeSlideshowRegistConfirmView
     * @constructor
     */
    var OpeSlideshowRegistConfirmView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/slideshow/slideshowRegistConfirm"),
        /**
         * ViewのテンプレートHTMLの描画処理が完了前に呼び出される。
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        beforeRendered : function() {

        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        afterRendered : function() {
            // 画像
            var $figure = this.$el.find('[data-figure]');
            var images = _.pluck(this.models, function(model) {
                return model.get("image");
            });
            var imgIndex = 0;

            $figure.each(function(i) {
                var $image = $(this).find('[data-figure-image]');
                var image = images[i];

                if (!image) {
                    return true;
                }

                $image.attr('src', image.src);
            });

        },

        /**
         * 初期化処理
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        initialize : function() {
        },

        events : {
            "click #slideshowBackButton" : "onClickSlideshowBackButton",
            "click #slideshowRegistButton" : "onClickSlideshowRegistButton"
        },

        /**
         * 戻るボタンを押下された際に呼び出されるコールバック関数。
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        onClickSlideshowBackButton : function() {
            this.$el.remove();
            $("#slideshowRegistPage").show();
            $("#snap-content").scrollTop(0);
            $("#contents__primary").scrollTop(0);
        },

        /**
         * 登録するボタンが押下された際に呼び出されるコールバック関数。
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        onClickSlideshowRegistButton : function() {
            var self = this;
            this.showLoading();

            async.each(this.models, function(model, done) {
                self.saveSlideshowPicture(model, done);
            }, function complete(err) {
                self.hideLoading();
                if (err) {
                    vexDialog.defaultOptions.className = 'vex-theme-default';
                    vexDialog.alert(err);
                    app.logger.error("OpeSlideshowRegistConfirmView#onClickSlideshowRegistButton():error:" + err);
                    return;
                }
                app.logger.debug("success all to save slideshow pictures.");
                app.router.go("ope-slideshow");
            });
        },
        /**
         * 添付された画像をdavへ登録する
         * @param {SlideshowModel} model
         * @param {Function} done async#each後のコールバック
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        saveSlideshowPicture : function(model, done) {
            var image = model.get("image");
            var davModel = new WebDavModel();
            davModel.set("path", "slideshow");
            davModel.set("fileName", image.fileName);

            davModel.set("data", image.data);
            davModel.set("contentType", image.contentType);

            this.saveDavFile(davModel, model, done);
        },
        /**
         * DAVファイルの登録
         * @param {WebDavModel} davModel webdavのmodel
         * @param {SlideshowModel} model
         * @param {Function} done async#each後のコールバック
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        saveDavFile : function(davModel, model, done) {
            davModel.save(null, {
                success : function() {
                    this.saveModel(model, done);
                }.bind(this),
                error : function(e) {
                    done("スライドショー画像の登録に失敗しました。");
                }
            });
        },
        /**
         * Modelの保存
         * @param {SlideshowModel} model
         * @param {Function} done async#each後のコールバック
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        saveModel : function(model, done) {
            model.save(null, {
                success : function() {
                    done();
                },
                error : function(e) {
                    done("スライドショー画像の登録に失敗しました。");
                }
            });
        }
    });
    module.exports = OpeSlideshowRegistConfirmView;
});
