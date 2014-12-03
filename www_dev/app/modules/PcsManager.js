define(function(require, exports, module) {
    "use strict";
    var Log = require("modules/util/logger");

    /**
     * アクセスマネージャクラスを作成する。
     * @class アクセスマネージャクラス
     * @exports AccountManager
     * @constructor
     */
    var PcsManager = function(app) {
        /** appオブジェクト */
        this.app = app;
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
        this.expireMargin = 300 * 1000; // 5分
        this.NOT_HAVE_TOKEN = 0;
        this.UNEXPIRE_ACCESS_TOKEN = 1;
        this.EXPIRE_ACCESS_TOKEN = 2;
        this.EXPIRE_REFRESH_TOKEN = 3;
    };

    /**
     * 現在の動作がデバイス上か非デバイスかを判別する。
     * @returns {Boolean} true:デバイス上、false:非デバイス
     */
    PcsManager.prototype.isAndroidDevice = function() {
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
    PcsManager.prototype.isExpireCachedToken = function() {
        if (this.accessToken) {
            var now = (new Date()).getTime();
            if (this.expirationRefreshDate) {
                if (now > (parseInt(this.expirationRefreshDate) - tiis.expireMargin)) {
                    Log.info("Expired refresh token : " + this.expirationRefreshDate);
                    return this.EXPIRE_REFRESH_TOKEN; // リフレッシュトークの期限切れ
                }
            }
            if (this.expirationDate) {
                if (now > (parseInt(this.expirationDate) - tiis.expireMargin)) {
                    Log.info("Expired access token : " + this.expirationDate);
                    return this.EXPIRE_ACCESS_TOKEN; // 期限切れ、リフレッシュ可能期間内
                } else {
                    Log.info("Unexpired access token : " + this.expirationDate);
                    return this.UNEXPIRE_ACCESS_TOKEN; // 期限内
                }
            }
        }
        Log.info("Do not have token");
        return this.NOT_HAVE_TOKEN; // トークンが存在しない
    };

    PcsManager.prototype.ready = function(callback) {
        // 現在の環境がAndroidデバイス上か？
        var androidDevice = this.isAndroidDevice();
        // 保持しているトークンの状態(期限チェック)
        var tokenStatus = this.isExpireCachedToken();
        Log.info("isAndroidDevice? : " + androidDevice);
        Log.info("Access Token status is : " + tokenStatus);

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

    /**
     *
     * @param param
     */
    PcsManager.prototype.getAuthTokenFromDeviceAccountManager = function(param) {
        Log.info("call getAccountsByType of AccountManager");
        this.androidAccountManager.getAccountsByType(this.packageName, $.proxy(function(error, accounts) {
            Log.info("getAccountsByType of AccountManager method responsed ");
            if (error) {
                param.error("account manager error : " + error);
                return;
            }
            if (!accounts || !accounts.length) {
                Log.info("this device has no accounts");
                this.expirationDate = "";
                this.accessToken = "";
                param.success();
                return;
            }
            var account = accounts[0];
            this.loginId = account.name;

            Log.info("call getAuthToken of AccountManager");
            this.androidAccountManager.getAuthToken(0, this.packageName, $.proxy(function(error, token) {
                Log.info("getAuthToken of AccountManager responsed : " + token);
                if (error) {
                    Log.info("error getAuthToken from AccountManager error-message:" + error);
                    param.error(error);
                    return;
                }
                // トークンの有効期限(expires-in)を取得する
                Log.info("call getUserData of AccountManager");
                this.androidAccountManager.getUserData(account, "ExpiresIn", $.proxy(function(error, data) {
                    if (error) {
                        Log.info("error getUserData from AccountManager error-message:" + error);
                        param.error(error);
                        return;
                    }
                    this.expirationDate = data;
                    this.accessToken = token;
                    Log.info("set expirationDate : " + data);
                    // 次回はキャッシュされたトークンが取得されないように、キャッシュをクリアする
                    this.androidAccountManager.invalidateAuthToken(this.packageName, this.accessToken, function(error) {
                        if (error) {
                            Log.info("error invalidateAuthToken from AccountManager error-message:" + error);
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
    PcsManager.prototype.registAccountManager = function(id, pw, onSuccess, onError) {
        console.log("stadrt registAccountManager");
        if (window.plugins) {
            this.androidAccountManager = window.plugins.accountmanager;
        }
        if (this.androidAccountManager) {
            var param = {
                baseUrl : this.app.config.basic.baseUrl,
                cellName : this.app.config.basic.cellId,
                schema : this.app.config.basic.schema,
                boxName : this.app.config.basic.boxName
            };
            console.log("regist start to AccountManager param : " + JSON.stringify(param));
            this.androidAccountManager.addAccountExplicitly(this.packageName, id, pw, param, function(error, account) {
                Log.info("regist account to AccountManager responsed");
                if (error) {
                    onError("error addAccountExplicitly from  AccountManager error-message:" + error);
                    return;
                }
                onSuccess();
            });
        } else {
            Log.info("account manager undefined (not android device)");
        }
    },
    module.exports = PcsManager;
});
