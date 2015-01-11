define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractModel = require("modules/model/AbstractModel");

    /**
     * 道場の◯◯編のモデル
     *
     * @class 道場の◯◯編のモデル
     * @exports DojoEditionModel
     * @constructor
     */
    var DojoEditionModel = AbstractModel.extend({
        /**
         * 初期化処理
         * @param {Object} attr
         * @param {Object} param
         * @memberOf DojoEditionModel#
         */
        initialize: function (attr, param) {
        },

        /**
         * 視聴済みコンテンツのモデルを返す
         * @return {Array} 視聴済コンテンツのモデルの配列
         * @memberOf DojoEditionModel#
         */
        getWatchedModels : function() {
            // TODO this.contentCollectionから実際の視聴済みコンテンツを返す
            return [];
        },

        /**
         * 道場コンテンツをレベル指定して取得する
         * @param {String} levelValue
         * @return {Array}
         * @memberOf DojoEditionView#
         */
        getModelsByLevel: function (levelValue) {
            var col;

            // 全ての道場コンテンツを取得する
            col = this.get("contentCollection");

            // sequenceでソートする
            col = col.sortBy(function(model) {
                return model.get("sequence");
            });

            // levelで絞り込む
            col = col.filter(function(model) {
                return (model.get("level") === levelValue);
            }.bind(this));

            return col;
        }
    });

    module.exports = DojoEditionModel;
});