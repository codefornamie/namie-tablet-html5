define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var LetterGlobalNavView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/common/global-nav"),

        /**
         *  ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         *  @memberOf GlobalNavView#
         */
        beforeRendered : function() {
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         *  @memberOf GlobalNavView#
         */
        afterRendered : function() {
        },

        /**
         *  初期化処理
         *  @memberOf GlobalNavView#
         */
        initialize : function() {
            this.initEvent();
        },

        /**
         * イベントを初期化する
         * @memberOf GlobalNavView#
         */
        initEvent: function () {
            this.listenTo(app.router, "route", this.onRoute);
        },

        /**
         *  イベント一覧
         *  @memberOf GlobalNavView#
         */
        events: {
            "click a" : "onClickMenuButton"
        },

        /**
         * メニュー項目ボタンのaタグをクリックした際の挙動を
         * ブラウザデフォルトではなく
         * pushStateに変更する
         * @memberOf GlobalNavView#
         */
        onClickMenuButton: function (evt) {
            var $target = $(evt.currentTarget);
            var href = { prop: $target.prop("href"), attr: $target.attr("href") };
            var root = location.protocol + "//" + location.host + app.root;

            if (href.prop && href.prop.slice(0, root.length) === root) {
                evt.preventDefault();
                app.router.navigate(href.attr, {
                    trigger: true,
                    replace: false
                });
            }
        },

        /**
         * ルーティングした時に呼ばれる
         * @memberOf GlobalNavView#
         * @param {String} route
         * @param {Object} params
         */
        onRoute: function (route, params) {
            switch (route) {
            case "letterSelect":
            case "letterEditComplete":
                $("#main").removeClass("is-subpage");
                break;

            default:
                $("#main").addClass("is-subpage");
                break;
            }

            // 前にもどるボタンの戻り先を変更
            switch (route) {
            case "letterEdit":
                $("[data-back-home]", this.$el).attr("href", "letters");
                break;

            default:
                $("[data-back-home]", this.$el).attr("href", "letter");
                break;
            }
}
    });

    module.exports = LetterGlobalNavView;
});
