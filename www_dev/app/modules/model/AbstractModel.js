define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    /**
     * 全てのモデルの基底クラスを作成する。
     * 
     * @class 全てののモデルの基底クラス
     * @exports AbstractModel
     * @constructor
     */
    var AbstractModel = Backbone.Model.extend({
        parse : function (response, options) {
            response = this.parseResponse(response, options);
            return response;
        },
        parseResponse : function(response, options) {
            return response;
        },
        /**
         * 指定されたプロパティの文字列情報内の改行コードを<br/>に変換する。
         * @return {String} 改行コードが<br/>に変換された文字列
         */
        getAndReplaceLineBreaks: function(name) {
            var value = this.get(name);
            if (value && typeof value.replace === "function") {
                return value.replace(/\r?\n/g, '<br />');
            } else {
                return value;
            }
        }
    });

    /**
     * createNewIdで使用するシーケンス。
     */
    AbstractModel.idSeq = 0;

    /**
     * 新規にIDを生成する。
     * <p>
     * __idに設定するためにidを生成する。<br>
     * 指定された日付データをもとにして、"YYYYMMDDJJNNSSQQQ + シーケンス番号"
     * のフォーマットでIDを生成する。<br>
     * シーケンス番号は、アプリケーションが起動してから、このメソッドが呼び出されるたびにインクリメントされる。
     * </p>
     * @memberOf AbstractModel# 
     * @return {String} ID
     */
    AbstractModel.createNewId = function() {
        return moment().format('YYYYMMDDHHmmssSSS') + (AbstractModel.idSeq++);
    };
    
    module.exports = AbstractModel;
});
