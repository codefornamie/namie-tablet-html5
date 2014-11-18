define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    /**
     * ログイン画面のモデルクラスを作成する。
     *
     * @class ログイン画面のモデルクラス
     * @exports LoginModel
     * @constructor
     */
    var LoginModel = Backbone.Model.extend({
        /** ログインID */
        loginId : null,
        /** パスワード */
        password : null,
        /** ログイン完了後に呼び出されるコールバック関数 */
        onLogin : null,
        /** baseurl */
        baseUrl : null,
        /** cellId */
        cellId : null,
        /** box */
        box : null,
        /** Account Manager */
        accountManager : null,
        /** package name */
        packageName : "jp.fukushima.namie.town.Pcs",

        /**
         * モデルの初期化処理を行う。
         */
        initialize : function(options) {
            this.baseUrl = app.config.basic.baseUrl;
            this.cellId = app.config.basic.cellId;
            this.box = app.config.basic.boxName;
            if (window.plugins) {
                this.accountManager = window.plugins.accountmanager;
            }
        },

        /**
         * AccountManager経由でトークンを取得
         * @memberOf LoginModel
         * @param {Function} callback トークン取得成功時のコールバック
         */
        authAccountManager : function(callback) {
            alert("authAccountManager ");
            if (!this.accountManager) {
                alert("accountManager null");
                return;
            }
            this.accountManager.getAccountsByType(this.packageName, $.proxy(function(error, accounts) {
                alert("onGetAccount");
                if (error) {
                    alert('ERROR: ' + error);
                    return;
                } else if (!accounts || !accounts.length) {
                    alert('This device has no accounts');
                    return;
                }
                //alert('#' + accounts.length + ' ACCOUNTS ON THIS DEVICE');
                var account = accounts[0];
                alert('Account: ' + JSON.stringify(account));
                this.accountManager.getAuthToken(0, "oauth", function(dummy, token) {
                    callback(token);
                });
            }, this));
        },

        /**
         * 入力された認証情報のバリデータ。
         * @memberOf LoginModel
         */
        validate : function() {
            // 検証には、underscore の便利メソッドを使っている。
            if (!this.get("loginId")) {
                return "ログインIDが入力されていません。";
            }
            if (!this.get("password")) {
                return "パスワードが入力されていません。";
            }
            return false;
        },

        /**
         * 認証処理を行う。
         * <p>
         * このモデルのloginId,passwordプロパティの値を利用して、認証処理を行う。<br>
         * 以下の場合、認証エラーとなる
         * <ul>
         * <li>ログインID,パスワードに誤りがあった場合</li>
         * </ul>
         * </p>
         *
         * @memberOf LoginModel
         * @param {Function} onLogin 認証完了後に呼び出されるコールバック関数。
         */
        login : function(onLogin) {
            this.onLogin = onLogin;

            try {
                var dcContext = new dcc.DcContext(this.baseUrl, this.cellId);
                dcContext.setAsync(true);

                var tokenStr = "AA~oGWKabNT2a-CIGqrfOuTl30EMSRHmiMIfJ6aI3Mq8ifZRQqlnI2Ukz-9F6FLF694CD-obyZyCXFRR-NCziZ-iC0p7cxaw_B6UnUkO1ycleM";
                var accessor = dcContext.withToken(tokenStr);

                //var accessor = dcContext.asAccount(this.cellId, this.get("loginId"), this.get("password"));
                // ODataコレクションへのアクセス準備（実際の認証処理）
                var cellobj = accessor.cell();
                var targetBox = cellobj.box("data");
                app.accessor = cellobj.accessor;
                app.box = targetBox;

                if (this.accountManager) {
                    alert("login accountManager aru");
                    this.accountManager.addAccountExplicitly(this.packageName, this.get("loginId"), this.get("password"), {}, function(error, account) {
                        alert("onAddAccount");
                        if (error) {
                            alert('ERROR: ' + error);
                            return;
                        }
                    });
                }
            } catch (e) {
                var message = "";
                if (e.name === "NetworkError") {
                    message = "ネットワーク接続エラーが発生しました。";
                } else {
                    message = "ユーザーID、または、パスワードが正しくありません。";
                }
                this.onLogin(message);
                return;
            }
            this.onLogin();
        },

        /**
         * トークンを指定してPCS接続.
         * @memberOf LoginModel
         * @param {String} token アクセストークン
         */
        setAccessToken : function(token) {
            alert("setToken");
            var dcContext = new dcc.DcContext(this.baseUrl, this.cellId);
            alert("a");
            dcContext.setAsync(true);
            alert("b");
            try {
                alert(token);
                var cellobj = dcContext.withToken(token).cell(this.cellId).box("data");
                alert("c");
                var targetBox = cellobj.box("data");
                app.accessor = cellobj.accessor;
                app.box = targetBox;
                alert("d");
            } catch (e) {
                alert(e);
            }
        }
    });
    module.exports = LoginModel;
});
