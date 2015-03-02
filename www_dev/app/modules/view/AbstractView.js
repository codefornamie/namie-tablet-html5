define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var WebDavModel = require("modules/model/WebDavModel");
    var FileAPIUtil = require("modules/util/FileAPIUtil");
    var CommonUtil = require("modules/util/CommonUtil");
    var colorbox = require("colorbox");
    var canvasToBlob = require("canvas-to-blob");
    var vexDialog = require("vexDialog");
    var PIOLogLevel = require("modules/util/logging/PIOLogLevel");

    /**
     * 全てのViewの基底クラスを作成する。
     * 
     * @class 全てのViewの基底クラス
     * @exports AbstractView
     * @constructor
     */
    var AbstractView = Backbone.Layout.extend({
        animation : null,
        animationDeley : 0,
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
         * サブクラスは本メソッドをオーバライドして、 描画前の独自の処理を実装できる。
         * </p>
         * @memberOf AbstractView#
         */
        beforeRendered : function() {
        },
        /**
         * 要素の描画処理が完了した際に呼び出される。
         * @memberOf AbstractView#
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
                $("input.error").each(function() {
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
         * サブクラスは本メソッドをオーバライドして、 描画後の独自の処理を実装できる。
         * </p>
         * @memberOf AbstractView#
         */
        afterRendered : function() {

        },

        /**
         * ローディングメッセージを表示する。
         * @memberOf AbstractView#
         */
        showLoading : function() {
            $.blockUI({
                message : "しばらくお待ちください",
                css : {
                    border : 'none',
                    padding : '10px',
                    backgroundColor : '#000',
                    '-webkit-border-radius' : '10px',
                    '-moz-border-radius' : '10px',
                    opacity : 0.5,
                    color : '#fff'
                }
            });
        },
        /**
         * プログレスバー付きローディングメッセージを表示する。
         * @memberOf AbstractView#
         */
        showProgressBarLoading : function() {
            $.blockUI({
                message : "しばらくお待ちください<br><progress max='100'></progress>",
                css : {
                    border : 'none',
                    padding : '10px',
                    backgroundColor : '#000',
                    '-webkit-border-radius' : '10px',
                    '-moz-border-radius' : '10px',
                    opacity : 0.5,
                    color : '#fff'
                }
            });
            this.$progressBar = $("progress");
            this.$progressBar.attr("value", 0);
        },
        /**
         * ローディングメッセージを閉じる
         * @memberOf AbstractView#
         */
        hideLoading : function() {
            $.unblockUI();
            this.$progressBar = [];
        },
        /**
         * aタグのクリックイベントを処理する。 ブラウザデフォルトではなくpushStateに変更する
         * @param {Event} evt
         * @memberOf AbstractView#
         */
        followAnchor : function(evt) {
            var $target = $(evt.currentTarget);
            var href = {
                prop : $target.prop("href"),
                attr : $target.attr("href")
            };
            var root = location.protocol + "//" + location.host + app.root;

            if (href.prop && href.prop.slice(0, root.length) === root) {
                evt.preventDefault();
                app.router.navigate(href.attr, {
                    trigger : true,
                    replace : false
                });
            }
        },

        /**
         * メッセージダイアログを表示する.
         * <p>
         * personium.ioのAPI呼び出しでエラーが発生した場合に、
         * 画面にエラーメッセージを表示するために利用する。
         * <br>
         * personium.io のAPI呼び出しエラーが、端末の通信状態に起因するものであった場合、<br>
         * 指定されたメッセージに加えて、通信状態に問題があることを示すメッセージを表示する。
         * これを回避する場合、showNetworkErrorパラメタに<code>false</code>を指定する。
         * </p>
         * @param {String} message メッセージ
         * @param {PIOEvent|Model} object エラーとなったイベント、または、操作対象のModel
         * @param {String} level ログ出力レベル。PIOLogLevelのINFO, WARN, ERRORのいすれかを指定する。未指定の場合、INFOとなる。
         * @param {Boolean} showNetworkError ネットワークエラーメッセージを表示するかどうか
         */
        showMessage : function(message, object, level, showNetworkError) {
            if (!level) {
                level = PIOLogLevel.INFO;
            }
            if (showNetworkError === undefined) {
                showNetworkError = true;
            }
            vexDialog.defaultOptions.className = 'vex-theme-default';
            if (showNetworkError && typeof object.isNetworkError === "function") {
                if (object.isNetworkError()) {
                    message = "通信エラーが発生したため、以下のエラーが発生しました。通信状態をご確認ください。<br/><br/>" + message;
                }
            }
            vexDialog.alert(message);
            switch (level) {
            case PIOLogLevel.INFO:
                app.logger.info(message + " [object: " + object + "]");
                break;
            case PIOLogLevel.WARN:
                app.logger.warn(message + " [object: " + object + "]");
                break;
            case PIOLogLevel.ERROR:
                app.logger.error(message + " [object: " + object + "]");
                break;
            }
        },
        /**
         * 操作に成功した際のメッセージを表示する。
         * <p>
         * loggingOnlyに<code>true</code>を指定した場合、ダイアログでのメッセージ表示は行わない。
         * </p>
         * @param {String} operation 成功した操作を表す文字列 (ex. メッセージ情報の保存)
         * @param {Object} target 操作対象オブジェクト
         * @param loggingOnly ログ記録のみかどうか。未指定の場合、<code>true</code>が設定される
         */
        showSuccessMessage: function(operation, target, loggingOnly) {
            if (loggingOnly === undefined) {
                // デフォルトはダイアログには表示しない
                loggingOnly = true;
            }
            var message = operation + "に成功しました。";
            if (!loggingOnly) {
                this.showMessage(message, target, app.PIOLogLevel.INFO);
            } else {
                app.logger.info(message + " object=" + target);
            }
        },
        /**
         * 操作に失敗した際のメッセージを表示する。
         * <p>
         * ダイアログに指定された操作のエラーメッセージを表示し、エラーログを記録する。
         * </p>
         * @param {String} operation 成功した操作を表す文字列 (ex. メッセージ情報の保存)
         * @param {Object} resp 処理の結果、personium.io が返却したエラー情報を含むレスポンス
         */
        showErrorMessage: function(operation, resp) {
            if (resp.event && resp.event.isConflict()) {
                this.showMessage("他のユーザーと操作が競合したため、" + operation + "を完了できませんでした。" +
                            "<br/>再度、操作を行ってください。", resp.event);
            } else {
                this.showMessage(operation + "に失敗しました。", resp.event, app.PIOLogLevel.ERROR);
            }
        },
        /**
         * 指定されたimg要素に、imgArrayパラメタで指定された画像のコンテンツを表示する。
         * 
         * @param {String} imgElementSelector 画像を表示する要素のセレクタ。<br/> このセレクタで取得される要素の数と、imgArrayの要素数は一致していなければならない。
         * @param {Array} imgArray 画像情報を含むオブジェクトの配列。<br/> 以下のプロパティを含める。<br/> imageUrl: 画像のDAVのファイルパス<br/> imageIndex:
         *                画像のインデックス<br/>
         * @param {Boolean} isExpansion 画像拡大処理を設定するかどうか<br/>
         * @memberOf AbstractView#
         */
        showPIOImages : function(imgElementSelector, imgArray, isExpansion, saveFunc) {
            var $articleImage = $(this.el).find(imgElementSelector);

            _.each(imgArray, $.proxy(function(item) {
                var $targetElem = $articleImage.eq(item.imageIndex - 1);
                this.showPIOImage($targetElem, item, isExpansion, saveFunc);
            }, this));
        },
        /**
         * 指定されたimg要素に、itemパラメタで指定された画像のコンテンツを表示する。
         * @param imgElement 画像を表示する要素
         * @param item 画像情報を含むオブジェクト。<br/> 以下のプロパティを含める。<br/> imageUrl: 画像のDAVのファイルパス
         * @param isExpansion 画像拡大処理を設定するかどうか
         * @param saveFunc 拡大表示画面の「画像保存」ボタン押下時に呼び出されるコールバック関数
         * @memberOf AbstractView#
         */
        showPIOImage : function(imgElement, item, isExpansion, saveFunc) {
            var $targetElem = imgElement;
            var onGetBinary = $.proxy(function(binary, item) {
                var arrayBufferView = new Uint8Array(binary);
                var blob = new Blob([
                    arrayBufferView
                ], {
                    type : "image/jpg"
                });
                var url = FileAPIUtil.createObjectURL(blob);
                $targetElem.load($.proxy(function() {
                    if (isExpansion) {
                        $targetElem.wrap("<a class='expansionPicture' href='" + url + "'></a>");
                        var $colorbox = $targetElem.parent().colorbox(
                                {
                                    closeButton : false,
                                    current : "",
                                    photo : true,
                                    maxWidth : "83%",
                                    maxHeight : "100%",
                                    onOpen : function() {
                                        // ライトボックスが開いている時に
                                        // OSの戻るボタンで記事詳細画面に戻れるように
                                        // URLを変更しておく
                                        location.hash = encodeURIComponent(url);
                                    },
                                    onComplete : function() {
                                        $colorbox.data("isClosingByBack", false);
                                        $("#colorbox").append(
                                                "<button id='cboxCloseButton' class='small button'>閉じる</button>");
                                        $("#colorbox").append(
                                                "<button id='cboxSaveButton' class='small button'>画像を保存</button>");
                                        $("#cboxCloseButton").click(function() {
                                            $.colorbox.close();
                                        });
                                        $("#cboxSaveButton").click(function(ev) {
                                            saveFunc(ev);
                                        });
                                        $("#colorbox").find("img").data("blob", blob);

                                        // OSの戻るボタンで戻った際に
                                        // closeLightBoxイベントが呼ばれる @app/router.js
                                        app.once("closeLightBox", function() {
                                            $colorbox.colorbox.close();
                                            $colorbox.data("isClosingByBack", true);
                                        });
                                    },
                                    onClosed : function() {
                                        $("#cboxSaveButton").remove();
                                        $("#cboxCloseButton").remove();

                                        // OSの戻るボタンで戻った際に
                                        // 二重でbackしないようにする
                                        if (!$colorbox.data("isClosingByBack")) {
                                            app.router.back();
                                        }
                                    }
                                });
                    }
                    window.URL.revokeObjectURL($(this).attr("src"));
                }, this, url, blob));
                $targetElem.attr("src", url);
            }, this);

            var onError = function(resp, item) {
                $targetElem.triggerHandler("error", resp);
            };

            try {
                if (item.imageUrl) {
                    var davModel = new WebDavModel();
                    var path = this.model.get("imagePath");

                    if (item.hasPath) {
                        path = "";
                    } else {
                        path = path ? path + "/" : "";
                    }
                    davModel.id = path + item.imageUrl;
                    davModel.fetch({
                        success : function(model, binary) {
                            onGetBinary(binary, item);
                        },

                        error : function(resp) {
                            onError(resp, item);
                        }
                    });
                }
            } catch (e) {
                console.error(e);
                onError(e, item);
            }
        },
        /**
         * ファイル名を元に、ユニークなID付きのファイル名を生成する
         * 
         * @memberOf AbstractView#
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
         * @memberOf AbstractView#
         * @param {String} fileName ファイル名
         * @return {String} 生成したファイルパス名
         */
        generateFilePath : function() {
            return moment().format("YYYY") + "/" + moment().format("MM-DD") + "/" + this.model.id;
        },
        /**
         * サムネイルを生成する。
         * 
         * @memberOf AbstractView#
         * @param {ByteArray} byteArray 元画像。
         * @param {Function} callback サムネイル生成後にコールバックされる。
         */
        makeThmbnail : function(byteArray, callback) {
            // サムネイルの長辺のサイズ
            var LONG_SIDE_SIZE = 256;
            var canvas = document.createElement('canvas');
            var img = new Image();
            img.onload = function() {
                var scale = Math.min(1, LONG_SIDE_SIZE / img.width, LONG_SIDE_SIZE / img.height);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                if (canvas.toBlob) {
                    canvas.toBlob(function(blob) {
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            callback(e.target.result);
                        };
                        reader.readAsArrayBuffer(blob);
                    }, 'image/png');
                }
            };
            img.src = "data:image/jpeg;base64," + this.encodeBase64(new Uint8Array(byteArray));
        },
        /**
         * base64データをバイナリデータに変換
         * 
         * @memberOf AbstractView#
         * @param {ByteArray} s 元画像。
         * @return {String} バイナリデータ
         */
        encodeBase64 : function(s) {
            var base64list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var t = "";
            var p = -6;
            var a = 0;
            var i = 0;
            var v = 0;
            var c;

            while ((i < s.length) || (p > -6)) {
                if (p < 0) {
                    if (i < s.length) {
                        c = s[i++];
                        v += 8;
                    } else {
                        c = 0;
                    }
                    a = ((a & 255) << 8) | (c & 255);
                    p += 8;
                }
                t += base64list.charAt((v > 0) ? (a >> p) & 63 : 64);
                p -= 6;
                v -= 6;
            }
            return t;
        }
    });

    module.exports = AbstractView;
});
