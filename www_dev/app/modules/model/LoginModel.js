define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var JsSha = require("jsSha");
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
            alert("初期化");
            alert(window);
            alert(window.plugins);
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
            if (window.plugins) {
                this.accountManager = window.plugins.accountmanager;
            }
            alert("アカウントマネージャ存在確認");
            alert(this.accountManager);

            if (!this.accountManager) {
                console.log("account maanger undefined (not android)");
                return;
            }
            alert("アカウントマネージャ認証開始");
            this.accountManager.getAccountsByType(this.packageName, $.proxy(function(error, accounts) {
                alert("アカウント情報あり ");
                console.log("account manager getAccountsByType method responsed ");
                if (error) {
                    console.log("account manager error : " + error);
                    return;
                } else if (!accounts || !accounts.length) {
                    console.log("this device has no accounts");
                    return;
                }
                // alert('#' + accounts.length + ' ACCOUNTS ON THIS DEVICE');
                var account = accounts[0];
                console.log("account : " + JSON.stringify(account));
                this.accountManager.getAuthToken(0, "oauth", function(dummy, token) {
                    alert("トークン取得成功 : " + token);
                    console.log("account manager getAuthToken responsed : " + token);
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
            console.log("login method in LoginModel start");
            this.onLogin = onLogin;
            console.log("1");
            try {
                alert("ログイン処理開始");
                var dcContext = new dcc.DcContext(this.baseUrl, this.cellId);
                dcContext.setAsync(true);
                console.log("2");

                // パスワードを暗号化
                var shaPassword = "";
                var shaObj = new JsSha(this.get("password"), "ASCII");
                shaPassword = shaObj.getHash("SHA-256", "HEX");
                shaPassword = shaPassword.substr(0, 32);
                console.log("3 " + this.get("loginId") + " / " + shaPassword);
                console.log(this.cellId);
                // PCSアクセス
                var accessor = dcContext.asAccount(this.cellId, this.get("loginId"), shaPassword);
                console.log("3a");
                console.log(accessor);
                console.log(accessor.accessToken);
                var cellobj = accessor.cell(this.cellId);
                console.log("4");
                var targetBox = cellobj.box("data");
                app.accessor = cellobj.accessor;
                app.box = targetBox;
                console.log("5");

                if (window.plugins) {
                    this.accountManager = window.plugins.accountmanager;
                }
                alert("アカウントマネージャ存在確認");
                alert(this.accountManager);
                // Androidで動作している場合、AccountManagerにアカウントを登録する
                if (this.accountManager) {
                    alert("アカウントマネージャ登録開始");
                    console.log("5");
                    var param = {
                        baseUrl : this.baseUrl,
                        cellName : this.cellId,
                        schema : "",
                        boxName : this.box
                    };
                    this.accountManager.addAccountExplicitly(this.packageName, this.get("loginId"), shaPassword, param,
                            function(error, account) {
                                console.log("account manager addAccountExplicitly responsed");
                                if (error) {
                                    var msg = "login failure : " + error;
                                    this.onLogin(msg);
                                    return;
                                }
                                alert("アカウントマネージャ登録成功");
                            });
                } else {
                    console.log("7");
                    console.log("account maanger undefined (not android)");
                }
            } catch (e) {
                console.log("8");
                console.log(e);
                var message = "";
                if (e.name === "NetworkError") {
                    message = "ネットワーク接続エラーが発生しました。";
                } else {
                    message = "ユーザーID、または、パスワードが正しくありません。";
                }
                console.log("login exception : " + message);
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
            console.log("set access token : " + token);
            alert(token);
            var dcContext = new dcc.DcContext(this.baseUrl, this.cellId);
            dcContext.setAsync(true);
            try {
                var cellobj = dcContext.withToken(token).cell(this.cellId);
                var targetBox = cellobj.box("data");
                app.accessor = cellobj.accessor;
                app.box = targetBox;
            } catch (e) {
                console.log("certificate failure : " + e);
            }
        }
    });
    module.exports = LoginModel;
});
