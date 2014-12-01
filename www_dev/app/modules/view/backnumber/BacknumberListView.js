define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var BacknumberListItemView = require("modules/view/backnumber/BacknumberListItemView");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var DateUtil = require("modules/util/DateUtil");
    var Equal = require("modules/util/filter/Equal");
    var IsNull = require("modules/util/filter/IsNull");

    /**
     * バックナンバーのリストのView
     * 
     * @class
     * @exports BacknumberListView
     * @constructor
     */
    var BacknumberListView = AbstractView.extend({
        /**
         * テンプレートファイル
         */
        template : require("ldsh!templates/{mode}/backnumber/backnumberList"),

        /**
         * 日付選択画面に表示する情報のcollection
         */
        articleCollection : new ArticleCollection(),

        /**
         * ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         */
        beforeRendered : function() {
            this.setBacknumberList();
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         */
        afterRendered : function() {
        },

        /**
         * 初期化処理
         */
        initialize : function() {
            this.setArticleSearchCondition({
                targetDate: new Date()
            });
        },

        events : {},

        /**
         * 記事の検索条件を指定する。
         * @param {Object} 検索条件。現在、targetDateプロパティにDateオブジェクトを指定可能。
         */
        setArticleSearchCondition : function(condition) {
            this.articleCollection.setSearchCondition(condition);
        },

        /**
         * バックナンバー一覧を描画する
         */
        setBacknumberList : function() {
            var self = this;

            this.collection.each(function(model) {
                var backnumberListView = new BacknumberListView();

                self.insertView('#backnumber-list', new BacknumberListItemView({
                    model : model
                }));
            });
        }
    });
    module.exports = BacknumberListView;
});
