define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var JsSha = require("jsSha");
    var PersonalCollection = require("modules/collection/personal/PersonalCollection");
    var PersonalModel = require("modules/model/personal/PersonalModel");
    var Equal = require("modules/util/filter/Equal");
    var And = require("modules/util/filter/And");
    var IsNull = require("modules/util/filter/IsNull");

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
        /** 暗号化済みパスワード */
        encryptionPassword : null,
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
         * @memberOf LoginModel
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
         * AccountManagerにアカウントが登録されていればトークンの取得を行う。
         * @memberOf LoginModel
         * @param {Function} callback トークン取得成功時のコールバック
         */
        getAuthToken : function(callback) {
            if (window.plugins) {
                this.accountManager = window.plugins.accountmanager;
            }
            console.log("▲ 1");
            if (!this.accountManager) {
                console.log("▲ 2");
                console.log("account maanger undefined (not android)");
                callback("showLoginView", "");
                return;
            }
            console.log("▲ 3");
            if ((app.accessToken) && (app.expirationDate)) {
                console.log("▲ 4");
                var margin = 300 * 1000;
                var now = (new Date()).getTime();
                if (now < (parseInt(app.expirationDate) - margin)) {
                    alert("ExpiresIn 切れ : now(" + now + ")/expire(" + app.expirationDate + ")");
                    callback("token");
                    return;
                }
            }
            // alert("アカウントマネージャ認証開始");
            console.log("▲ 5");
            this.accountManager.getAccountsByType(this.packageName, $.proxy(function(error, accounts) {
                console.log("▲ 6");
                // alert("アカウントマネージャチェック終了 : " + accounts.length + "件");
                console.log("account manager getAccountsByType method responsed ");
                if (error) {
                    console.log("account manager error : " + error);
                    callback("showLoginView", "");
                    return;
                } else if (!accounts || !accounts.length) {
                    console.log("this device has no accounts");
                    callback("showLoginView", "");
                    return;
                }
                var account = accounts[0];
                // AccuntManagerからログインIDを取得
                this.set("loginId", account.name);

                // 認証トークンを取得する
                this.accountManager.getAuthToken(0, "oauth", $.proxy(function(error, token) {
                    alert("トークン取得成功 : " + token);
                    console.log("account manager getAuthToken responsed : " + token);
                    if (error) {
                        callback("error", error);
                        return;
                    }
                    // トークンの有効期限(expires-in)を取得する
                    this.accountManager.getUserData(account, "ExpiresIn", $.proxy(function(error, data) {
                        if (error) {
                            alert("Error getUserData " + error);
                            callback("error", error);
                            return;
                        }
                        app.expirationDate = data;
                        app.accessToken = token;
                        alert(app.expirationDate);
                        alert(app.accessToken);
                        // 次回はキャッシュされたトークンが取得されないように、キャッシュをクリアする
                        this.accountManager.invalidateAuthToken(this.packageName, app.accessToken, function(error) {
                            if (error) {
                                console.log("error invalidateAuthToken for AccountManager");
                            }
                        });
                        callback("token", "");
                    }, this));
                }, this));
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
         * ID/PWでPCS認証を行う。
         * @memberOf LoginModel
         * @param {String} id ユーザーID
         * @param {String} pw パスワード
         */
        certificationWithAccount : function(id, pw) {
            var dcContext = new dcc.DcContext(this.baseUrl, this.cellId);
            dcContext.setAsync(true);
            var accessor = dcContext.asAccount(this.cellId, id, pw);
            var cellobj = accessor.cell(this.cellId);
            var targetBox = cellobj.box("data");
            app.accessor = cellobj.accessor;
            app.box = targetBox;
        },

        /**
         * トークンを指定してPCS接続。
         * @memberOf LoginModel
         * @param {String} token アクセストークン
         */
        certificationWithToken : function() {
            // alert("トークン認証(?)開始");
            console.log("set access token : " + app.accessToken);
            var dcContext = new dcc.DcContext(this.baseUrl, this.cellId);
            dcContext.setAsync(true);
            try {
                console.log("■□ 1");
                var cellobj = dcContext.withToken(app.accessToken).cell(this.cellId);
                console.log("■□ 2");
                var targetBox = cellobj.box("data");
                console.log("■□ 3");
                app.accessor = cellobj.accessor;
                app.box = targetBox;
            } catch (e) {
                // alert("トークン認証でエラー : " + e);
                console.log("certificate failure : " + e);
            }
        },

        /**
         * AccountManagerにアカウントを登録する。
         * @param {String} id ユーザーID
         * @param {String} pw パスワード
         */
        registAccountManager : function(id, pw) {
            if (window.plugins) {
                this.accountManager = window.plugins.accountmanager;
            }
            if (this.accountManager) {
                // alert("アカウントマネージャ登録開始");
                var param = {
                    baseUrl : this.baseUrl,
                    cellName : this.cellId,
                    schema : "",
                    boxName : this.box
                };
                this.accountManager.addAccountExplicitly(this.packageName, id, pw, param, function(error, account) {
                    console.log("account manager addAccountExplicitly responsed");
                    if (error) {
                        this.onLogin("login failure : " + error);
                        return;
                    }
                    // alert("アカウントマネージャ登録成功");
                });
            } else {
                console.log("account manager undefined (not android)");
            }
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
            try {
                if (app.accessToken) {
                    this.certificationWithToken();
                } else {
                    var id = this.get("loginId");
                    var pw = this.get("encryptionPassword");
                    if (!pw) {
                        // パスワードを暗号化
                        var shaPassword = "";
                        var shaObj = new JsSha(this.get("password"), "ASCII");
                        shaPassword = shaObj.getHash("SHA-256", "HEX");
                        pw = shaPassword.substr(0, 32);
                    }

                    this.certificationWithAccount(id, pw);
                    this.registAccountManager(id, pw);
                    console.log("★☆ f");

                }
            } catch (e) {
                alert(e);
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
            // alert("パ情作成開始");
            // alert(this.get("loginId"));
            console.log("★☆ a");
            var collection = new PersonalCollection();
            collection.condition.filters = [
                new And([
                        new Equal("loginId", this.get("loginId")), new IsNull("deletedAt")
                ])
            ];
            collection.fetch({
                success : $.proxy(function() {
                    console.log("★☆ d");
                    if (collection.size() !== 0) {
                        // 既にパーソナル情報が登録されている場合
                        app.user = collection.models[0];
                        this.onLogin();
                    } else {
                        // パーソナル情報が登録されていない場合
                        var personalModel = new PersonalModel();
                        personalModel.set("loginId", this.get("loginId"));
                        personalModel.set("fontSize", "middle");
                        personalModel.save(null, {
                            success : $.proxy(function() {
                                // パーソナル情報新規登録成功
                                app.user = personalModel;
                                this.onLogin();
                            }, this),
                            error : $.proxy(function() {
                                // パーソナル情報新規登録に失敗
                                this.onLogin("ユーザ情報の登録に失敗しました。再度ログインしてください。");
                            }, this)
                        });
                    }
                }, this),
                error : $.proxy(function() {
                    console.log("★☆ e");
                    // パーソナル情報検索に失敗
                    this.onLogin("ユーザ情報の取得に失敗しました。再度ログインしてください。");
                }, this)
            });
            
            // TODO 新聞の発行時刻 最終的にはDBから読み込む。
            app.news = {};
            app.news.publishTime = "17:00";
        },
    });
    module.exports = LoginModel;
});
