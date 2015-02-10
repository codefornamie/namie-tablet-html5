define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var DateUtil = require("modules/util/DateUtil");
    var SlideshowModel = require("modules/model/slideshow/SlideshowModel");
    var Equal = require("modules/util/filter/Equal");

    /**
     * スライドショー情報のコレクションクラス。
     * 
     * @class スライドショー情報のコレクションクラス
     * @exports SlideshowCollection
     * @constructor
     */
    var SlideshowCollection = AbstractODataCollection.extend({
        model : SlideshowModel,
        /**
         * 操作対象のEntitySet名
         * @memberOf SlideshowCollection#
         */
        entity : "slideshow",
        /**
         * 初期化処理
         * @memberOf SlideshowCollection#
         */
        initialize : function() {
            this.condition = {
                top : 100,
                orderby : "createdAt desc"
            };
        },
        /**
         * スライドショーの検索条件を指定する。
         * @memberOf SlideshowCollection#
         */
        setSearchCondition : function() {
        }
    });

    module.exports = SlideshowCollection;
});
