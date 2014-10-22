define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    /**
     * 全てのViewの基底クラスを作成する。
     * 
     * @class 全てのViewの基底クラス
     * @exports AbstractView
     * @constructor
     */
    var AbstractView = Backbone.Layout.extend({

        beforeRender : function() {
            this.beforeRendered();
        },
        /**
         * 描画前の処理を実装する。
         * <p>
         * サブクラスは本メソッドをオーバライドして、
         * 描画前の独自の処理を実装できる。
         * </p>
         */
        beforeRendered : function() {
            
        },
        afterRender : function() {
            this.afterRendered();
            if (this.formId) {
                var self = this;
             // バリデーションを設定
                $(this.formId).validate({
                    submitHandler : function() {
                        return false;
                    },
                    invalidHandler : function() {
//                        self.onValidateError();
                        return false;
                    },
                    onsubmit : false
                });
            }
        },
        /**
         * 描画後の処理を実装する。
         * <p>
         * サブクラスは本メソッドをオーバライドして、
         * 描画後の独自の処理を実装できる。
         * </p>
         */
        afterRendered : function() {
            
        },
        initialize : function() {

        },

        events : {

        },
    });

    module.exports = AbstractView;
});
