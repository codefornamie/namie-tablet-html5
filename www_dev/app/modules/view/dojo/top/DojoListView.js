define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DojoListItemView = require("modules/view/dojo/top/DojoListItemView");
    var DojoContentCollection = require("modules/collection/dojo/DojoContentCollection");
    var FeedListView = require("modules/view/news/FeedListView");
    var Super = FeedListView;

    /**
     * 道場アプリのコンテンツ一覧を表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports DojoListView
     * @constructor
     */
    var DojoListView = FeedListView.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberOf DojoListView#
         */
        template : require("ldsh!templates/{mode}/top/dojoList"),

        /**
         * 記事一覧を表示する要素のセレクタ
         * @memberOf DojoListView#
         */
        listElementSelector : "#dojo-list",

        /**
         * テンプレートに渡す情報をシリアライズする
         * @return {Object}
         */
        serialize: function () {
            return _.extend({}, Super.prototype.serialize.call(this), {
                levels: this.extractLevels()
            });
        },

        /**
         * Viewの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberOf DojoListView#
         */
        beforeRendered : function() {
            this.extractLevels();

            Super.prototype.beforeRendered.call(this);
        },

        /**
         * Viewの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf DojoListView#
         */
        afterRendered : function() {
            Super.prototype.afterRendered.call(this);
        },

        /**
         * 初期化
         * @memberOf DojoListView#
         */
        initialize : function() {
            console.assert(this.collection, "DojoListView should have a collection");

            Super.prototype.setFeedListItemViewClass.call(this, DojoListItemView);
        },

        /**
         * コレクション内のモデルの値から級の一覧を作る
         * @memberOf DojoListView#
         */
        extractLevels : function() {
            var levels = {};
            // 級の名称を収集し、重複を削除する
            var levelValues = this.collection.map(function(model) {
                return model.get("level");
            });
            levelValues = _.uniq(levelValues);

            // 「級の名称=>インデックス」の対応を格納する
            _.each(levelValues, function(levelValue, index) {
                //levels[levelValue] = index;
                levels[index] = levelValue;
            });

            return levels;
        },

        /**
         * 取得した動画一覧を描画する
         * @memberOf DojoListView#
         */
        setFeedList : function() {
            var self = this;
            var animationDeley = 0;
            // 選択されている級の文字列表現を取得する。この値は、dojo_movie#levelの文字列と同じ
            var levelValue = this.level.get("level");
            this.collection.each($.proxy(function(model) {
                if (model.get("level") === levelValue) {
                    var ItemView = self.feedListItemViewClass;
                    this.insertView(this.listElementSelector, new ItemView({
                        model : model,
                        animationDeley : animationDeley,
                        parentView: this
                    }));
                    animationDeley += 0.2;
                }

            }, this));
        }
    });

    module.exports = DojoListView;
});
