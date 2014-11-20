define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractModel = require("modules/model/AbstractModel");
    var DateUtil = require("modules/util/DateUtil");
    var CommonUtil = require("modules/util/CommonUtil");

    /**
     * 記事情報のモデルクラスを作成する。
     *
     * @class 記事情報のモデルクラス
     * @exports BacknumberModel
     * @constructor
     */
    var BacknumberModel = AbstractModel.extend({
        /**
         * モデルの初期値を返す
         *
         * @return {Object}
         */
        defaults: function () {
            // [TODO]
            // ダミーデータを入れているので
            // 正式なデータ取得処理に置き換えるべき
            return {
                createdAt: new Date(2014, 11, 10)
            };
        },

        /**
         * createdAtをYYYY-MM-DDの文字列にして返す
         *
         * @return {String}
         */
        generateDateString: function () {
            var d = new Date(this.get('createdAt'));
            var dateString = DateUtil.formatDate(d, 'yyyy-MM-dd');

            return dateString;
        }
    });

    module.exports = BacknumberModel;
});
