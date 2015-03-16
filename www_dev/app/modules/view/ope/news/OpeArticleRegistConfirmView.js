define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var ArticleRegistConfirmView = require("modules/view/posting/news/ArticleRegistConfirmView");
    var vexDialog = require("vexDialog");

    /**
     * 記事登録確認画面のViewクラス
     * 
     * @class 記事登録確認画面のViewクラス
     * @exports OpeArticleRegistConfirmView
     * @constructor
     */
    var OpeArticleRegistConfirmView = ArticleRegistConfirmView.extend({

        /**
         * Modelの保存
         */
        saveModel : function(){
            this.model.save(null, {
                success : $.proxy(function() {
                    if (this.model.get("isRecommend") && this.recommendArticle &&
                            this.recommendArticle.get("__id") !== this.model.get("__id")) {
                        this.recommendArticle.set("isRecommend",null);
                        this.recommendArticle.save(null, {
                            success:$.proxy(function() {
                                app.router.go("ope-top", this.targetDate);
                            },this),
                            error:$.proxy(function() {
                                app.router.go("ope-top", this.targetDate);
                            },this)
                        });
                    }else {
                        app.router.go("ope-top", this.targetDate);
                    }
                }, this),
                error: function(model, resp, options){
                    this.hideLoading();
                    this.showErrorMessage("記事情報の保存", resp);
                }.bind(this)
            });
        }
    });
    module.exports = OpeArticleRegistConfirmView;
});
