define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractModel = require("modules/model/AbstractModel");

    /**
     * 道場のコンテンツのモデルクラスを作成する。
     *
     * @class 記事情報のモデルクラス
     * @exports DojoContentModel
     * @constructor
     */
    var DojoContentModel = AbstractModel.extend({
        /**
         * モデルの初期値を返す
         *
         * @return {Object}
         */
        defaults: function () {
            return {};
        },

        /**
         * 初期化処理
         * @param {Object} attr
         * @param {Object} param
         */
        initialize: function (attr, param) {
        }
    });

    module.exports = DojoContentModel;
});