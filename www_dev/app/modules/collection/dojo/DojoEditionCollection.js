define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractCollection = require("modules/collection/AbstractCollection");
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");

    /**
     * 道場の◯◯編のコレクションクラス
     * 
     * @class
     * @exports DojoEditionCollection
     * @constructor
     */
    var DojoEditionCollection = AbstractCollection.extend({
        model : DojoEditionModel,
        
        /**
         * 現在表示中の edition のインデックス
         */
        _currentEditionIndex: 0,
        
        /**
         * 初期化処理
         */
        initialize: function () {
        },

        /**
         * 現在表示中の DojoEditionModel を返す
         * @return {DojoEditionModel}
         */
        getCurrentEdition: function () {
            var edition = this.at(this._currentEditionIndex);

            return edition;
        }
    });

    module.exports = DojoEditionCollection;
});