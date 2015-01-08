define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var NewsView = require("modules/view/news/NewsView");

    /**
     * 運用管理アプリの記事一覧画面を表示するためのViewクラスを作成する。
     * 
     * @class 運用管理アプリの記事一覧画面を表示するためのView
     * @exports OpeNewsPreviewView
     * @constructor
     */
    var OpeNewsPreviewView = NewsView.extend({
        template : require("ldsh!templates/news/news/news"),
        /**
         * プレビューかどうか
         * @memberOf OpeNewsPreviewView#
         */
        isPreview : true,

        /**
         * News一覧の各Gridがクリックされたときの動作
         * 
         * @param {jQuery.Event} ev
         * @param {Object} param
         * @memberOf OpeNewsPreviewView#
         */
        onClickGridItem : function(ev, param) {
            // プレビューのためクリックを無視するため何もしない
        },

    });

    module.exports = OpeNewsPreviewView;
});
