define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    /**
     * YouTubeのモデルクラスを作成する。
     * 
     * @class YouTubeのモデルクラス
     * @exports YouTubeModel
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
         * @memberOf hmc.model.LoginModel#
         * @param {Object}
         *            attrs 入力パラメタ
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
         * 認証は以下のフローで行われる。
         * <ul>
         * <li>PCSの認証APIに対して認証処理をリクエスト</li>
         * <li>動作中のセルから、ログインIDに対応するスタッフ情報を取得</li>
         * </ul>
         * なお、ログインユーザがadminユーザの場合、スタッフ情報の取得は実施しない。
         * </p>
         * <p>
         * 以下の場合、認証エラーとなる
         * <ul>
         * <li>ログインID,パスワードに誤りがあった場合</li>
         * <li>対象のスタッフが転籍状態の場合</li>
         * </ul>
         * </p>
         * @memberOf hmc.model.LoginModel#
         * @param {Function}
         *            onLogin 認証完了後に呼び出されるコールバック関数。 以下のシグネチャの関数を指定する。<br>
         *
         * <pre><code>
         * function(event:hmc.event.HmcEvent)
         * </code></pre>
         */
        login : function(onLogin) {
            this.onLogin = onLogin;
            
            try {
                var dcContext = new dcc.DcContext("https://fj.baas.jp.fujitsu.com/","namie-test");
                var accessor = dcContext.asAccount("namie-test",this.get("loginId"),this.get("password"));
                // ODataコレクションへのアクセス準備（実際の認証処理）
                var cellobj = accessor.cell();
                var targetBox = cellobj.ctl.box.retrieve("box");
//                var odata = targetBox.odata('odatacol');
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
            app.accessor = cellobj.accessor;
            this.onLogin();
        },
        /**
         * 認証API失敗時のコールバック関数。
         *
         * @memberOf hmc.model.LoginModel#
         * @param {tritium.ODataEvent}
         *            event 認証処理結果
         */
        onLoginFailure : function(event) {
        }
    });

    module.exports = LoginModel;
});
