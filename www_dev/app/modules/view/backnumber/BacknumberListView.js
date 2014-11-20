define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var BacknumberListItemView = require("modules/view/backnumber/BacknumberListItemView");

    /**
     *  バックナンバーのリストのView
     *
     *  @class
     *  @exports BacknumberListView
     *  @constructor
     */
    var BacknumberListView = AbstractView.extend({
        /**
         *  テンプレートファイル
         */
        template : require("ldsh!templates/{mode}/backnumber/backnumberList"),

        /**
         *  ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         */
        beforeRendered : function() {
            this.setBacknumberList();
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         */
        afterRendered : function() {
        },

        /**
         *  初期化処理
         */
        initialize : function() {
        },

        events : {
        },

        /**
         *  バックナンバー一覧を描画する
         */
        setBacknumberList: function () {
            var self = this;

            this.collection.each(function (model) {
                var backnumberListView = new BacknumberListView();

                self.insertView('#backnumber-list', new BacknumberListItemView({
                    model: model
                }));
            });
        }
    });
    module.exports = BacknumberListView;
});