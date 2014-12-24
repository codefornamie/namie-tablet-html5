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
        }
    });

    module.exports = DojoEditionModel;
});