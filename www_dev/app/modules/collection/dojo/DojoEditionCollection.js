define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractCollection = require("modules/collection/AbstractCollection");
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");

    /**
     * 道場の◯◯編のコレクションクラス
     * 
     * @class 道場の◯◯編のコレクションクラス
     * @exports DojoEditionCollection
     * @constructor
     */
    var DojoEditionCollection = AbstractCollection.extend({
        model : DojoEditionModel,
        
        /**
         * 現在表示中の edition のインデックス
         * @memberOf DojoEditionCollection#
         */
        _currentEditionIndex: 0,
        
        /**
         * 初期化処理
         * @memberOf DojoEditionCollection#
         */
        initialize: function () {
        },

        /**
         * 現在表示中の DojoEditionModel を返す
         * @memberOf DojoEditionCollection#
         * @return {DojoEditionModel} 道場編毎モデル
         */
        getCurrentEdition: function () {
            var model = this.models[0];
            var models = model && model.get("models");
            var edition = models && models[this._currentEditionIndex];

            return edition;
        },

        /**
         * 表示する edition のインデックスを変更する
         * @param {Number} index
         * @memberOf DojoEditionCollection#
         */
        setEditionIndex: function (index) {
            this._currentEditionIndex = index || 0;
            this.trigger("edition");
        }
    });

    module.exports = DojoEditionCollection;
});