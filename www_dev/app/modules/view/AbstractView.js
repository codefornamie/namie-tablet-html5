define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var FileAPIUtil = require("modules/util/FileAPIUtil");

    /**
     * 全てのViewの基底クラスを作成する。
     * 
     * @class 全てのViewの基底クラス
     * @exports AbstractView
     * @constructor
     */
    var AbstractView = Backbone.Layout.extend({
        animation: null,
        animationDeley: 0,
        serialize : function() {
            return {
                model : this.model
            };
        },
        beforeRender : function() {
            if (this.templateMap) {
                var t = this.templateMap[app.config.basic.mode];
                if (t) {
                    this.template = t;
                }
            }

            this.beforeRendered();
            if (this.animation) {
                this.$el.addClass('animated ' + this.animation);
            }
            if (this.animationDeley) {
                this.$el.css("-webkit-animation-delay", this.animationDeley + "s");
            }
        },
        /**
         * 描画前の処理を実装する。
         * <p>
         * サブクラスは本メソッドをオーバライドして、
         * 描画前の独自の処理を実装できる。
         * </p>
         * @memberof AbstractView#
         */
        beforeRendered : function() {
        },
        /**
         * 要素の描画処理が完了した際に呼び出される。
         * @memberof AbstractView#
         */
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
                        self.onValidateError();
                        return false;
                    },
                    onsubmit : false
                });
            }
        },
        /**
         * バリデーションチェックがNGの場合。
         * <p>
         * submitせずに、エラーの位置にスクロールする。
         * </p>
         */
        onValidateError : function() {
            var that = this;
            setTimeout(function() {
                $("input.error").each(
                    function() {
                        if ($(this).css("display") == "none") {
                            return true;
                        }
                        var scroller = $(this).closest(".scroller");
                        var top = -10 - scroller.offset().top + scroller.scrollTop() + $(this).offset().top;
                        scroller.animate({
                            scrollTop : top
                        }, 500, "swing");
                        return false;
                    }, this);
            }, 0);
        },
        /**
         * 描画後の処理を実装する。
         * <p>
         * サブクラスは本メソッドをオーバライドして、
         * 描画後の独自の処理を実装できる。
         * </p>
         * @memberof AbstractView#
         */
        afterRendered : function() {
            
        },

        /**
         * ローディングメッセージを表示する。
         * @memberof AbstractView#
         */
        showLoading : function () {
            $.blockUI({
                message: "しばらくお待ちください",
                css: {
                    border: 'none', 
                    padding: '10px', 
                    backgroundColor: '#000', 
                    '-webkit-border-radius': '10px', 
                    '-moz-border-radius': '10px', 
                    opacity: 0.5, 
                    color: '#fff' 
                }
            }); 
        },
        /**
         * ローディングメッセージを閉じる
         * @memberof AbstractView#
         */
        hideLoading :function () {
            $.unblockUI();
        },
        /**
         * 指定されたimg要素に、imgArrayパラメタで指定された画像のコンテンツを表示する。
         * 
         * @param {String} imgElementSelector 画像を表示する要素のセレクタ。<br/>
         * このセレクタで取得される要素の数と、imgArrayの要素数は一致していなければならない。
         * @param {Array} imgArray 画像情報を含むオブジェクトの配列。<br/>
         * 以下のプロパティを含める。<br/>
         * imageUrl: 画像のDAVのファイルパス<br/>
         * imageIndex: 画像のインデックス<br/>
         * @memberof AbstractView#
         */
        showPIOImages : function(imgElementSelector, imgArray) {
            var $articleImage = $(this.el).find(imgElementSelector);

            var onGetBinary = $.proxy(function(binary,item) {
                var arrayBufferView = new Uint8Array(binary);
                var blob = new Blob([ arrayBufferView ], {
                    type : "image/jpg"
                });
                var url = FileAPIUtil.createObjectURL(blob);

                $articleImage.eq(item.imageIndex-1).load(function() {
                    window.URL.revokeObjectURL($(this).attr("src"));
                });
                $articleImage.eq(item.imageIndex-1).attr("src", url);
                $articleImage.eq(item.imageIndex-1).data("blob", blob);
            },this);
            
            var onError = function (resp, item) {
                $articleImage.eq(item.imageIndex-1).triggerHandler("error", resp);
            };

            _.each(imgArray,$.proxy(function (item) {
                try {
                    app.box.col("dav").getBinary(item.imageUrl, {
                        success : function(binary) {
                            onGetBinary(binary,item);
                        },

                        error: function (resp) {
                            onError(resp, item);
                        }
                    });
                } catch (e) {
                    console.error(e);
                    onError(e, item);
                }
            },this));
        }
    });

    module.exports = AbstractView;
});
