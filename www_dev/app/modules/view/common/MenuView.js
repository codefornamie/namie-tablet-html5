define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var MenuView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/common/menu"),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {
        },

        events : {
            'click a': 'onClickAnchor',
            "click #top" : "onClickTop",
            "click #favorite" : "onClickFavorite",
            "click #help" : "onClickHelp",
            "click #backno" : "onClickBackno",
            "click #setting" : "onClickSetting"
        },

        /**
         * aタグをクリックした際の挙動を
         * ブラウザデフォルトではなく
         * pushStateに変更する
         */
        onClickAnchor: function (evt) {
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
            $('#snap-content').data("snap").close();
        },
        onClickTop : function(evt) {
            app.ga.trackEvent("全ページ共通", "サイドメニュー内の項目「TOP」","");
        },
        onClickFavorite : function(evt) {
            app.ga.trackEvent("全ページ共通", "サイドメニュー内の項目「切り抜き」","");
        },
        onClickHelp : function(evt) {
            app.ga.trackEvent("全ページ共通", "サイドメニュー内の項目「ヘルプ」","");
        },
        onClickBackno : function(evt) {
            app.ga.trackEvent("全ページ共通", "サイドメニュー内の項目「バックナンバー」","");
        },
        onClickSetting : function(evt) {
            app.ga.trackEvent("全ページ共通", "サイドメニュー内の項目「設定」","");
        }
    });

    module.exports = MenuView;
});
