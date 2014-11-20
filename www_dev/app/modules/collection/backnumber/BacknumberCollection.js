define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractCollection = require("modules/collection/AbstractCollection");
    var BacknumberModel = require("modules/model/backnumber/BacknumberModel");

    /**
     * 記事情報のコレクションクラス
     *
     * @class
     * @exports BacknumberCollection
     * @constructor
     */
    var BacknumberCollection = AbstractCollection.extend({
        model : BacknumberModel,

        /**
         *  初期化処理
         */
        initialize: function () {
            // [TODO]
            // ダミーデータを5件入れているので
            // 正式なデータ取得処理に置き換えるべき
            for (var i = 0; i < 5; i++) {
                this.push(new BacknumberModel());
            }
        }
    });

    module.exports = BacknumberCollection;
});
