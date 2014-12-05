define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractCollection = require("modules/collection/AbstractCollection");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var DojoEditionCollection = require("modules/collection/dojo/DojoEditionCollection");
    var DojoContentModel = require("modules/model/dojo/DojoContentModel");
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");

    /**
     * 道場のコンテンツのコレクションクラス
     * 
     * @class
     * @exports DojoContentCollection
     * @constructor
     */
    // TODO ArticleCollectionと同じ処理をしているので、道場コンテンツの読み込みに修正する
    var DojoContentCollection = ArticleCollection.extend({
        model : DojoContentModel,

        /**
         * collectionが持つmodelを◯◯編ごとに分配し、それをDojoEditionCollectionとして返す
         * @return {DojoEditionCollection}
         */
        groupByEditions: function () {
            var editionCollection = new DojoEditionCollection();

            this.each(function (model) {
                // この model を入れる先の DojoEditionModel を決定する
                // TODO 今は暫定で"type"という属性を利用している
                var editionKey = model.get("type");
                var editionModel = editionCollection.findWhere({
                    editionKey: editionKey
                });
                
                // 既にこのeditionを入れる先があれば、そこに入れる
                // まだ無ければ、作って入れる
                if (!editionModel) {
                    editionModel = new DojoEditionModel({
                        editionKey: editionKey,
                        editionTitle: "ダミータイトル" + _.uniqueId() + "(DojoContentCollectionで指定しています)"
                    });
                    editionModel.set("contentCollection", new DojoContentCollection());
                    editionCollection.push(editionModel);
                }

                var contentCollection = editionModel.get("contentCollection");
                contentCollection.push(model);
                editionModel.set("contentCollection", contentCollection);
            });

            return editionCollection;
        }
    });

    module.exports = DojoContentCollection;
});
