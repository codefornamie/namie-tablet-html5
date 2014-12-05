define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var ArticleModel = require("modules/model/article/ArticleModel");
    var Super = ArticleModel;

    /**
     * 道場のコンテンツのモデルクラスを作成する。
     *
     * @class 記事情報のモデルクラス
     * @exports DojoContentModel
     * @constructor
     */
    var DojoContentModel = ArticleModel.extend({
        /**
         * 初期化処理
         * @param {Object} attr
         * @param {Object} param
         */
        initialize: function (attr, param) {
            Super.prototype.initialize.call(this, attr, param);
        },
        
        /**
         * コンテンツの習得状態を文字列で返す ("solved" or "unsolved")
         * @return {String}
         */
        getSolvedState: function () {
            // TODO 道場コンテンツの習得状態によって文字列を返すようにする
            return _.shuffle(["solved", "unsolved"])[0];
        },
        
        /**
         * コンテンツの視聴状態を文字列で返す ("watched" or "unwatched")
         * @return {String}
         */
        getWatchedState: function () {
            // TODO 道場コンテンツの視聴状態によって文字列を返すようにする
            return _.shuffle(["watched", "unwatched"])[0];
        }
    });

    module.exports = DojoContentModel;
});