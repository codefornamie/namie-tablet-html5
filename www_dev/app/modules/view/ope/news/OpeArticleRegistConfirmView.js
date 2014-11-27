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
                    if (this.model.get("isRecommend") && this.recommendArticle
                            && this.recommendArticle.get("__id") !== this.model.get("__id")) {
                        this.recommendArticle.set("isRecommend",null);
                        this.recommendArticle.save(null, {
                            success:$.proxy(function() {
                                app.router.go("ope-top");
                            },this),
                            error:$.proxy(function() {
                                app.router.go("ope-top");
                            },this)
                        });
                    }else {
                        app.router.go("ope-top");
                    }
                }, this),
                error: function(e){
                    this.hideLoading();
                    vexDialog.alert("保存に失敗しました。");
                }
            });
        }
    });
    module.exports = OpeArticleRegistConfirmView;
});
