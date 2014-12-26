define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var WebDavModel = require("modules/model/WebDavModel");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var CommonUtil = require("modules/util/CommonUtil");
    var colorbox = require("colorbox");

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
         * @param {Boolean} isExpansion 画像拡大処理を設定するかどうか<br/>
         * @memberof AbstractView#
         */
        showPIOImages : function(imgElementSelector, imgArray, isExpansion, saveFunc) {
            var $articleImage = $(this.el).find(imgElementSelector);

            var onGetBinary = $.proxy(function(binary, item) {
                var arrayBufferView = new Uint8Array(binary);
                var blob = new Blob([
                    arrayBufferView
                ], {
                    type : "image/jpg"
                });
                var url = FileAPIUtil.createObjectURL(blob);

                var $targetElem = $articleImage.eq(item.imageIndex - 1);

                $targetElem.load($.proxy(function() {
                    if (isExpansion) {
                        $targetElem.wrap("<a class='expansionPicture' href='" + url + "'></a>");
                        $(".expansionPicture").colorbox({
                            closeButton : false,
                            current : "",
                            photo : true,
                            maxWidth : "83%",
                            maxHeight : "100%",
                            onComplete : function() {
                                $("#colorbox").append("<button id='cboxCloseButton' class='small button'>閉じる</button>");
                                $("#colorbox").append("<button id='cboxSaveButton' class='small button'>画像を保存</button>");
                                $("#cboxCloseButton").click(function() {
                                    $.colorbox.close();
                                });
                                $("#cboxSaveButton").click(function(ev) {
                                    saveFunc(ev);
                                });
                                $("#colorbox").find("img").data("blob",blob);
                            },
                            onClosed : function() {
                                $("#cboxSaveButton").remove();
                                $("#cboxCloseButton").remove();
                            }
                        });
                    }
                    window.URL.revokeObjectURL($(this).attr("src"));
                }, this, url, blob));
                $targetElem.attr("src", url);
            }, this);
            
            var onError = function (resp, item) {
                $articleImage.eq(item.imageIndex-1).triggerHandler("error", resp);
            };
            
            _.each(imgArray,$.proxy(function (item) {
                try {
                    if(item.imageUrl){
                        var davModel = new WebDavModel();
                        var path = this.model.get("imagePath");
                        path = path ? path + "/" : "";
                        davModel.id = path + item.imageUrl;
                        davModel.fetch({
                            success : function(model, binary) {
                                onGetBinary(binary,item);
                            },

                            error: function (resp) {
                                onError(resp, item);
                            }
                        });
                    }
                } catch (e) {
                    console.error(e);
                    onError(e, item);
                }
            },this));
        },
        /**
         * ファイル名を元に、ユニークなID付きのファイル名を生成する
         * 
         * @memberof AbstractView#
         * @param {String} fileName ファイル名
         * @return {String} 生成したファイルパス名
         */
        generateFileName : function(fileName) {
            fileName = CommonUtil.blankTrim(fileName);
            var preName = fileName.substr(0, fileName.lastIndexOf("."));
            var suffName = fileName.substr(fileName.lastIndexOf("."));

            return preName + "_" + new Date().getTime() + _.uniqueId("") + suffName;
        },
        /**
         * ファイル名を元に、ユニークなID付きのファイル名を生成する
         * 
         * @memberof AbstractView#
         * @param {String} fileName ファイル名
         * @return {String} 生成したファイルパス名
         */
        generateFilePath : function() {
            return moment().format("YYYY-MM-DD") + "/" + this.model.id;
        }
    });

    module.exports = AbstractView;
});
