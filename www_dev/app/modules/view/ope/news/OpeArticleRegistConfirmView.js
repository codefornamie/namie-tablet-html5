/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
