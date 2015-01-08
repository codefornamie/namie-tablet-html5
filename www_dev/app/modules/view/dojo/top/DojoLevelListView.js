define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Code = require("modules/util/Code");
    var AbstractView = require("modules/view/AbstractView");
    var DojoListItemView = require("modules/view/dojo/top/DojoListItemView");

    /**
     * 道場アプリのコース一覧を表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのコース一覧を表示するためのView
     * @exports DojoLevelListView
     * @constructor
     */
    var DojoLevelListView = AbstractView.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberOf DojoLevelListView#
         */
        template : require("ldsh!templates/{mode}/top/dojoLevelList"),

        /**
         * テンプレートに渡す情報をシリアライズする
         * @return {Object}
         */
        serialize: function () {
            return {
                levels: this.extractLevels(),
            };
        },

        /**
         * 初期化
         * @memberOf DojoLevelListView#
         */
        initialize : function() {
            console.assert(this.collection, "DojoLevelListView should have a collection");
        },

        /**
         * コレクション内のモデルの値から級の一覧を作る
         * @memberOf DojoLevelListView#
         */
        extractLevels : function() {
            // 定義されている級のリストを取得する
            // TODO: 将来的には、級の定義情報はperosnium.ioに定義する
            var levels = Code.DOJO_LEVELS;
            return levels;
//            var levels = {};
//            // 級の名称を収集し、重複を削除する
//            var levelValues = this.collection.map(function(model) {
//                return model.get("level");
//            });
//            levelValues = _.uniq(levelValues);
//
//            // 「級の名称=>インデックス」の対応を格納する
//            _.each(levelValues, function(levelValue, index) {
//                levels[levelValue] = index;
//            });
//
//            return levels;
        },
    });

    module.exports = DojoLevelListView;
});
