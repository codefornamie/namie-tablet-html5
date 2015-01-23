define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    /**
     * おくやみ一覧の各おくやみ情報を表示するためのViewを作成する。
     * @memberOf CondolenceListView#
     * @class おくやみ一覧アイテムのView
     * @exports CondolenceListItemView
     * @constructor
     */
    var CondolenceListItemView = AbstractView.extend({
        /**
         * このViewを表示する際に利用するテンプレート
         * @memberOf CondolenceListItemView#
         */
        template : require("ldsh!templates/{mode}/news/condolence/condolenceListItem"),
    });

    module.exports = CondolenceListItemView;
});
