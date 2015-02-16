define(function(require, exports, module) {

    var app = require("app");
    var AbstractModel = require("modules/model/AbstractModel");
    var AbstractView = require("modules/view/AbstractView");
    var WebDavModel = require("modules/model/WebDavModel");
    
    var ArticleRegistView = require("modules/view/posting/news/ArticleRegistView");
    var DateUtil = require("modules/util/DateUtil");
    var CommonUtil = require("modules/util/CommonUtil");
    var vexDialog = require("vexDialog");

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
         *  ViewのテンプレートHTMLの描画処理が完了前に呼び出される。
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        beforeRendered : function() {

        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        afterRendered : function() {
            var $image = this.$el.find('[data-figure-image]');
            var image = this.model.get('image');
            $image.attr('src', image.src);
        },

        /**
         *  初期化処理
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
        onClickSlideshowBackButton : function(){
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
            this.showLoading();
            this.saveSlideshowPicture();
        },
        /**
         * 添付された画像をdavへ登録する
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        saveSlideshowPicture : function() {
            if(!this.model.get("__id")){
                this.model.id = AbstractModel.createNewId();
            }
            if(!this.model.get("filename")){
                this.model.set("filename", this.generateFilePath());
            }

            var image = this.model.get("image");
            var davs = [];
            if(image.data){
                var davModel = new WebDavModel();
                davModel.set("path", "slideshow");
                davModel.set("fileName", image.fileName);

                davModel.set("data", image.data);
                davModel.set("contentType", image.contentType);
                davs.push(davModel);
            }

            this.saveDavFile(davs);
        },
        /**
         * DAVファイルの登録
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        saveDavFile : function(davs) {
            var imageCount = davs.length;
            if(imageCount > 0){
                _.each(davs, $.proxy(function(davModel){
                    davModel.save(null, {
                        success : $.proxy(function(e){
                            if(--imageCount <= 0){
                                this.saveModel();
                            }
                        }, this),
                        error: $.proxy(function(e){
                            this.hideLoading();
                            vexDialog.defaultOptions.className = 'vex-theme-default';
                            vexDialog.alert("保存に失敗しました。");
                            app.logger.error("保存に失敗しました。");
                        }, this)
                    });
                }, this));
            } else {
                this.saveModel();
            }
        },
        /**
         * Modelの保存
         * @memberOf OpeSlideshowRegistConfirmView#
         */
        saveModel : function(){
            this.model.save(null, {
                success : $.proxy(function() {
                    app.router.go("ope-slideshow");
                }, this),
                error: function(e){
                    this.hideLoading();
                    vexDialog.alert("保存に失敗しました。");
                    app.logger.error("保存に失敗しました。");
                }
            });
        }
    });
    module.exports = OpeSlideshowRegistConfirmView;
});
