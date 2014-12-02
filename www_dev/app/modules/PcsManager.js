define(function(require, exports, module) {
    "use strict";
    var app = require("app");

    /**
     * アクセスマネージャクラスを作成する。
     * @class アクセスマネージャクラス
     * @exports AccountManager
     * @constructor
     */
    var AccountManager = function() {
        /** package name */
        this.packageName = "jp.fukushima.namie.town.Pcs";
        /** アクセストークン */
        this.accessToken = "";
        /** リフレッシュトークン */
        this.refreshToken = "";
        /** トークンの有効期限 */
        this.expirationDate = "";
        /** リフレッシュトークンの有効期限 */
        this.expirationRefreshDate = "";
        /** Android アカウントマネージャ */
        this.androidAccountManager = null;
        /** ログインID */
        this.loginId = "";
        /** Expireチェックのマージン時間 */
        var expireMargin = 300 * 1000; // 5分
        var NOT_HAVE_TOKEN = 0;
        var UNEXPIRE_ACCESS_TOKEN = 1;
        var EXPIRE_ACCESS_TOKEN = 2;
        var EXPIRE_REFRESH_TOKEN = 3;
    };

    /**
     * 現在の動作がデバイス上か非デバイスかを判別する。
     * @returns {Boolean} true:デバイス上、false:非デバイス
     */
    AccountManager.isAndroidDevice = function() {
        var ret = false;
        if (window.plugins) {
            this.androidAccountManager = window.plugins.accountmanager;
        }
        if (this.androidAccountManager) {
            return true;
        }
        return ret;
    };

    /**
     * 現在保持されているトークンが有効期限が切れているかどうかチェックする。
     * @returns {Number}
     */
    AccountManager.isExpireCachedToken = function() {
        if (this.accessToken) {
            var now = (new Date()).getTime();
            if (this.expirationRefreshDate) {
                if (now > (parseInt(this.expirationRefreshDate) - tiis.expireMargin)) {
                    console.log("Expired refresh token : " + this.expirationRefreshDate);
                    return this.EXPIRE_REFRESH_TOKEN; // リフレッシュトークの期限切れ
                }
            }
            if (this.expirationDate) {
                if (now > (parseInt(this.expirationDate) - tiis.expireMargin)) {
                    console.log("Expired access token : " + this.expirationDate);
                    return this.EXPIRE_ACCESS_TOKEN; // 期限切れ、リフレッシュ可能期間内
                } else {
                    console.log("Unexpired access token : " + this.expirationDate);
                    return this.UNEXPIRE_ACCESS_TOKEN; // 期限内
                }
            }
        }
        console.log("Do not have token");
        return this.NOT_HAVE_TOKEN; // トークンが存在しない
    };

    AccountManager.ready = function(callback) {
        // 現在の環境がAndroidデバイス上か？
        var androidDevice = this.isAndroidDevice();
        // 保持しているトークンの状態(期限チェック)
        var tokenStatus = this.isExpireCachedToken();

        // 保持しているトークンが利用できる場合は、何もせずに復帰
        if (tokenStatus === this.UNEXPIRE_ACCESS_TOKEN) {
            // 期限内
            callback();
            return;
        }
        // 期限外で、Androidの場合は、AccountManagerからトークン再取得
        if (androidDevice) {
            // AccountManagerからトークンを再取得
            this.getAuthTokenFromDeviceAccountManager({
                success: function() {
                    callback();
                },
                error: function(msg) {
                    callback(msg);
                }
            });
        } else {
            if (tokenStatus === this.EXPIRE_ACCESS_TOKEN) {
                // 期限切れ、リフレッシュ可能期間内
                // リフレッシュ認証を行う
            }
            if (tokenStatus === this.EXPIRE_REFRESH_TOKEN) {
                // ログイン画面へ
            }
            if (tokenStatus === this.NOT_HAVE_TOKEN) {
                // パスワード認証を行う
            }
        }
    };

    AccountManager.getAuthTokenFromDeviceAccountManager = function(param) {
        this.androidAccountManager.getAccountsByType(this.packageName, $.proxy(function(error, accounts) {
            console.log("account manager getAccountsByType method responsed ");
            if (error) {
                param.error("account manager error : " + error);
                return;
            }
            if (!accounts || !accounts.length) {
                console.log("this device has no accounts");
                this.expirationDate = "";
                this.accessToken = "";
                param.success();
                return;
            }
            var account = accounts[0];
            this.loginId = account.name;

            this.androidAccountManager.getAuthToken(0, this.packageName, $.proxy(function(error, token) {
                console.log("account manager getAuthToken responsed : " + token);
                if (error) {
                    console.log("error getAuthToken from AccountManager error-message:" + error);
                    param.error(error);
                    return;
                }
                // トークンの有効期限(expires-in)を取得する
                this.androidAccountManager.getUserData(account, "ExpiresIn", $.proxy(function(error, data) {
                    if (error) {
                        console.log("error getUserData from AccountManager error-message:" + error);
                        param.error(error);
                        return;
                    }
                    this.expirationDate = data;
                    this.accessToken = token;
                    // 次回はキャッシュされたトークンが取得されないように、キャッシュをクリアする
                    this.androidAccountManager.invalidateAuthToken(this.packageName, this.accessToken, function(error) {
                        if (error) {
                            console.log("error invalidateAuthToken from AccountManager error-message:" + error);
                        }
                    });
                    param.success();
                }, this));
            }, this));
        }, this));
    };

    /**
     * AccountManagerにアカウントを登録する。
     * @param {String} id ユーザーID
     * @param {String} pw パスワード
     */
    AccountManager.registAccountManager = function(id, pw, onSuccess, onError) {
        if (window.plugins) {
            this.androidAccountManager = window.plugins.accountmanager;
        }
        if (this.androidAccountManager) {
            var param = {
                baseUrl : app.config.basic.baseUrl,
                cellName : app.config.basic.cellId,
                schema : app.config.basic.schema,
                boxName : app.config.basic.boxName
            };
            this.androidAccountManager.addAccountExplicitly(this.packageName, id, pw, param, function(error, account) {
                console.log("regist account manager responsed");
                if (error) {
                    onError("error addAccountExplicitly from  AccountManager error-message:" + error);
                    return;
                }
            });
        } else {
            console.log("account manager undefined (not android device)");
        }
    },




    module.exports = AccountManager;
});
