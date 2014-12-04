define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractCollection = require("modules/collection/AbstractCollection");
    var DojoContentModel = require("modules/model/dojo/DojoContentModel");

    /**
     * 道場のコンテンツのコレクションクラス
     * 
     * @class
     * @exports DojoContentCollection
     * @constructor
     */
    var DojoContentCollection = AbstractCollection.extend({
        model : DojoContentModel,

        /**
         * 初期化処理
         */
        initialize : function() {
        }
    });

    module.exports = DojoContentCollection;
});
