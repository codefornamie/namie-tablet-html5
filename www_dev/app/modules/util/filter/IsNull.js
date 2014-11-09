define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Equal = require("modules/util/filter/Equal");

    /**
     * $filterのeq演算子を利用してnull比較を行う式を生成するクラスを作成する。
     * 
     * @class $filterのeq演算子を利用してnull比較を行う式を生成するクラス
     * @exports IsNull
     * @constructor
     */
    var IsNull = Equal.extend({
        init : function(key) {
            this._super(key, null);
        }
    });

    module.exports = IsNull;
});
