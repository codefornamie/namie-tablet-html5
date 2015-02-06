define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var WebDavModel = require("modules/model/WebDavModel");
    var AbstractView = require("modules/view/AbstractView");
    var FileAPIUtil = require("modules/util/FileAPIUtil");

    /**
     * 記事編集画面のViewクラス
     * 
     * @class 記事編集画面のViewクラス
     * @exports LetterEditView
     * @constructor
     */
    var LetterEditView = AbstractView.extend({
        /**
         * @memberOf LetterEditView#
         */
        template : require("ldsh!templates/{mode}/edit/letterEdit"),

        /**
         * Layoutがレンダリングされたら呼ばれる
         * @memberOf LetterEditView#
         */
        afterRendered : function() {
            if(this.model.get("imageThumbUrl")){
                var davModel = new WebDavModel();
                var path = this.model.get("imagePath");
                path = path ? path + "/" : "";
                davModel.id = path + this.model.get("imageThumbUrl");
                davModel.fetch({
                    success : $.proxy(function(model, binary) {
                        app.logger.debug("getBinary()");
                        var arrayBufferView = new Uint8Array(binary);
                        var blob = new Blob([
                            arrayBufferView
                        ], {
                            type : "image/jpg"
                        });

                        var url = FileAPIUtil.createObjectURL(blob);
                        var imgElement = this.$el.find(".letterPicture");
                        imgElement.load(function() {
                        });
                        imgElement.attr("src", url);
                    },this),
                    error: $.proxy(function () {
                        app.logger.error("画像の取得に失敗しました");
                    },this)
                });
            }
        },

        /**
         * イベント一覧
         * @memberOf LetterEditView#
         */
        events : {
            "click [data-update-letter]" : "onClickUpdateLetter"
        },

        /**
         * 初期化する
         * @memberOf LetterEditView#
         * @param {Object} param
         */
        initialize : function(param) {
            console.assert(param, "param should be specified");
            console.assert(param.letterModel, "param.letterModel should be specified");

            this.model = param.letterModel;
        },

        /**
         * 更新するボタンが押された後に呼ばれる
         * @param {Event} ev
         * @memberOf LetterEditView#
         */
        onClickUpdateLetter : function(ev) {
            alert("更新しました(DUMMY)");
            app.router.go("letters/" + this.model.get("__id") + "/modified");
        }
    });

    module.exports = LetterEditView;
});