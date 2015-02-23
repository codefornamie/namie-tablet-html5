define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractODataCollection = require("modules/collection/AbstractODataCollection");
    var CharacterMessageModel = require("modules/model/message/CharacterMessageModel");

    /**
     * キャラクターメッセージ情報のコレクションクラスを作成する。
     * 
     * @class キャラクターメッセージ情報のコレクションクラス
     * @exports CharacterMessageCollection
     * @constructor
     */
    var CharacterMessageCollection = AbstractODataCollection.extend({
        /**
         * このコレクションのModelクラス
         * @memberOf CharacterMessageCollection#
         */
        model : CharacterMessageModel,
        /**
         * 操作対象のEntitySet名
         * @memberOf CharacterMessageCollection#
         */
        entity : "character_message",
        /**
         * 初期化処理
         * @memberOf SlideshowCollection#
         */
        initialize : function() {
            this.condition = {
                top : 100,
                orderby : "createdAt desc"
            };
        }
    });

    module.exports = CharacterMessageCollection;
});
