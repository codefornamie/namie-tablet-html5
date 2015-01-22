define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var CondolenceListItemView = require("modules/view/news/condolence/CondolenceListItemView");

    /**
     * おくやみ一覧のViewを作成する。
     * 
     * @class おくやみ一覧アイテムのView
     * @exports CondolenceListView
     * @constructor
     */
    var CondolenceListView = AbstractView.extend({
        /**
         * このViewを表示する際に利用するテンプレート
         * @memberOf CondolenceListView#
         */
        template : require("ldsh!templates/{mode}/news/condolence/condolenceList"),
        /**
         * このViewのモデル情報を生成して返却する。
         * @returns Viewのモデル情報
         * @memberOf CondolenceListView#
         */
        serialize : function() {
            return {
                model : this.model.get("articles")[0]
            };
        },
        /**
         * 描画前の処理を実装する。
         * <p>
         * おくやみ情報を一覧に追加する。
         * </p>
         * @memberOf CondolenceListView#
         */
        beforeRendered : function() {
            this.setCondolenceList();
        },
        /**
         * おくやみ一覧を描画する。
         * @memberOf CondolenceListView#
         */
        setCondolenceList : function() {
            _.each(this.model.get("articles"), $.proxy(function(mappingModel) {
                _.each(mappingModel.get("articles"), $.proxy(function(model) {
                    this.insertView("#condolenceList", new CondolenceListItemView({
                        model : model,
                    }));
                }, this));
            }, this));
        }
    });

    module.exports = CondolenceListView;
});
