define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var WebDavModel = require("modules/model/WebDavModel");
    
    var ArticleRegistFileItemView = require("modules/view/posting/news/ArticleRegistFileItemView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");

    /**
     * 記事登録画面のファイル登録コンポーネントViewクラス
     * 
     * @class 記事登録画面のファイル登録コンポーネントViewクラス
     * @exports ArticleRegistFileItemView
     * @constructor
     */
    var OpeSlideshowRegistFileItemView = ArticleRegistFileItemView.extend({
        template : require("ldsh!templates/{mode}/slideshow/slideshowRegistFileItem"),
    });
    module.exports = OpeSlideshowRegistFileItemView;
});
