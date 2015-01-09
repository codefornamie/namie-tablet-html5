define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    
    /**
     * ヘッダのViewクラスを作成する。
     * 
     * @class ヘッダのViewクラス
     * @exports HeaderView
     * @constructor
     */
    var HeaderView = AbstractView.extend({
        template : require("ldsh!templates/dojo/top/header")
    });

    module.exports = HeaderView;
});
