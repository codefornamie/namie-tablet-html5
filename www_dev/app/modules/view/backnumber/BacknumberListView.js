define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var moment = require("moment");
    var AbstractView = require("modules/view/AbstractView");
    var BacknumberListItemView = require("modules/view/backnumber/BacknumberListItemView");

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
         * @memberOf BacknumberListView#
         */
        template : require("ldsh!templates/{mode}/backnumber/backnumberList"),

        /**
         * ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         * @memberOf BacknumberListView#
         */
        beforeRendered : function() {
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * @memberOf BacknumberListView#
         */
        afterRendered : function() {
        },

        /**
         * 初期化処理
         * @memberOf BacknumberListView#
         */
        initialize : function() {
            console.assert(this.collection, "Should have Collection");

            this.views = [];
            this.listenTo(this.collection, "add", this.onAddModel);
            this.listenTo(this.collection, "sync", this.onSyncModel);
            this.listenTo(this.collection, "reset", this.clear);

            // ローディング表示切り替え用のイベント
            this.listenTo(this.collection, "startLoading", this.onStartLoading);
            this.listenTo(this.collection, "finishLoading", this.onFinishLoading);

            this.collection.setMonth(moment());
        },

        events : {},
        
        /**
         * 要素をクリアする
         * @memberOf BacknumberListView#
         */
        clear: function () {
            this.views.length = 0;
            this.$el.find("#backnumber-list").empty();
        },

        /**
         * BacknumberModelが追加されたら呼ばれる
         * @param {Backnumber.Model} model
         * @memberOf BacknumberListView#
         */
        onAddModel: function (model) {
            this.views.push(new BacknumberListItemView({
                model: model
            }));
        },
        
        /**
         * collectionが揃ったら呼ばれる
         * @memberOf BacknumberListView#
         */
        onSyncModel: function () {
            var self = this;

            this.views.forEach(function (view) {
                self.insertView('#backnumber-list', view);
            });

            this.renderViews();
        },
        
        /**
         * 読み込みが始まったら呼ばれる
         * @memberOf BacknumberListView#
         */
        onStartLoading: function () {
            this.showLoading();
        },

        /**
         * 読み込みが終わったら呼ばれる
         * @memberOf BacknumberListView#
         */
        onFinishLoading: function () {
            $('#backnumber').scrollTop(0);

            this.hideLoading();
        }
    });
    module.exports = BacknumberListView;
});
