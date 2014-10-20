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
        /**
         * 入力された認証情報のバリデータ。
         * 
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
         * @param {Function}
         *            onLogin 認証完了後に呼び出されるコールバック関数。
         */
        login : function(onLogin) {
            this.onLogin = onLogin;

            try {
                var dcContext = new dcc.DcContext("https://fj.baas.jp.fujitsu.com/", "namiedev01");
                dcContext.setAsync(true);

                var accessor = dcContext.asAccount("namiedev01", this.get("loginId"), this.get("password"));
                // ODataコレクションへのアクセス準備（実際の認証処理）
                var cellobj = accessor.cell();
                var targetBox = cellobj.ctl.box.retrieve("box1");
                app.accessor = cellobj.accessor;
            } catch (e) {
                var message = "";
                if (!e.statusCode) {
                    message = "ネットワーク接続エラーが発生しました。";
                } else {
                    message = "ユーザーID、または、パスワードが正しくありません。";
                }
                this.onLogin(message);
                return;
            }

            this.onLogin();
        },
    });

    module.exports = LoginModel;
});
