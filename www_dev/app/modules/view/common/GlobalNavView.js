/* jshint eqnull:true */

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var DateUtil = require("modules/util/DateUtil");
    var AbstractView = require("modules/view/AbstractView");
    var PersonalModel = require("modules/model/personal/PersonalModel");
    var Snap = require("snap");

    var GlobalNavView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/common/global-nav"),

        /**
         * 文字サイズ変更後のタイマー
         */
        fontTimer : null,

        /**
         *  ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         */
        beforeRendered : function() {
        },

        /**
         *  ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         */
        afterRendered : function() {
            this.updateBackHomeButton();
            this.updateDateLabel();
            var $target = $("[value='" + app.user.get("fontSize") + "']");
            var size = parseInt($target.attr('data-font-size'), 10);
            $('html, body').css('font-size', size + 'px');
            this.setDate(this.targetDate);
        },

        /**
         *  初期化処理
         */
        initialize : function() {
            // snap.jsを初期化する
            this.snapper = new Snap({
                element: $('#snap-content')[0],
                tapToClose: true,
                touchToDrag: false
            });
            $('#snap-content').data("snap",this.snapper);

            // ルーティングのイベントハンドラを登録する
            app.router.on('route:globalNav', this.onRoute.bind(this));
        },

        /**
         *  viewがremoveされる時に呼ばれる
         */
        cleanup: function () {
            app.router.off('route:globalNav');
        },

        /**
         * RadiationエンティティセットへのFetch成功時のイベントハンドラ。
         */
        onFetchRadiation: function() {
            var model = this.collection.at(0);
            var value = "-";
            if (model) {
                value = model.get("value");
            }
            $("#radiationValue").text(value + "μSv/h");
        },

        events : {
            'click [data-drawer-opener]': 'onClickDrawerOpener',
            'click [data-back-home]': 'onClickBackHome',
            'change #selectRadiation' : "onChangeRadiationStation",
            'click [data-font-size]': 'onClickFontSize',

            'click .global-nav__menubutton a': 'onClickMenuButton',
            'click #help' : 'onClickHelp',
            'click #backno' : 'onClickBackno',
            'click #setting' : 'onClickSetting'
        },


        /**
         * 発行日を設定する。
         * @param {Date} date 設定する日付
         */
        setDate : function(date) {
            if (date) {
                $("#naviPublishDate").show();
                $("#naviPublishDate").find(".date--year").text(date.getFullYear());
                $("#naviPublishDate").find(".date--month").text(date.getMonth() + 1);
                $("#naviPublishDate").find(".date--day").text(date.getDate());
                $("#naviPublishDate").find(".date--weekday").text(DateUtil.formatDate(date, "ddd"));
            } else {
                $("#naviPublishDate").hide();
            }
        },

        /**
         *  今日の新聞に戻るボタンは
         *  topでは表示しない
         */
        updateBackHomeButton: function () {
            if (Backbone.history.fragment == 'top') {
                $('[data-back-home]').hide();
                $('.global-nav__menu').css('background-position', 'center');
            } else {
                $('[data-back-home]').show();
                $('.global-nav__menu').css('background-position', 'right');
            }
        },

        /**
         *  日付の表記を変更
         */
        updateDateLabel: function () {
            var fragments = Backbone.history.fragment.split('/');
            if (fragments[0] == 'backnumber') {
                $('.global-nav__date .nav-content').html('バックナンバー');
            }
        },

        /**
         *  サンドイッチボタンがクリックされたら呼ばれる
         *  @param {Event} ev
         */
        onClickDrawerOpener: function (ev) {
            app.ga.trackEvent("新聞アプリ/全ページ共通", "ヘッダ部メニュー","");
            ev.preventDefault();
            this.snapper.open('left');
        },

        /**
         *  今日の新聞に戻るボタンが押されたら呼ばれる
         */
        onClickBackHome: function (ev) {
            ev.preventDefault();
            app.router.back();
        },

        /**
         *  フォントサイズ変更ボタンが押されたら呼ばれる
         */
        onClickFontSize: function (ev) {
            $(document).trigger('willChangeFontSize');

            var $target = $(ev.currentTarget);
            var size = parseInt($target.attr('data-font-size'), 10);
            app.ga.trackEvent("新聞アプリ/全ページ共通", "文字サイズ選択", parseInt(size));
            $('html, body').css('font-size', size + 'px');

            $(document).trigger('didChangeFontSize');

            // 連続で押下された場合にリクエストが多数飛ばないようにするため
            // 数秒後に文字サイズ登録リクエストを飛ばす。
            // この間に再度文字サイズを変更されると前回の登録処理は無効とする
            if (this.fontTimer !== null) {
                clearTimeout(this.fontTimer);
            }
            this.fontTimer = setTimeout($.proxy(function() {
                this.saveFontSize($target.attr("value"));
            },this),1500);
        },

        /**
         *  文字サイズの保存処理
         *  @param {String} fontSize 文字サイズ
         */
        saveFontSize: function (fontSize) {
            var model = app.user;
            model.set("fontSize",fontSize);
            model.set("etag","*");
            // 文字サイズのみの保存処理のため、成功時や失敗時に
            // その都度ユーザに通知しない
            model.save(null,{});
        },

        /**
         * メニュー項目ボタンのaタグをクリックした際の挙動を
         * ブラウザデフォルトではなく
         * pushStateに変更する
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
            $('#snap-content').data("snap").close();
        },
        onClickHelp : function(evt) {
            app.ga.trackEvent("新聞アプリ/全ページ共通", "ヘッダ部メニュー内の項目「ヘルプ」","");
        },
        onClickBackno : function(evt) {
            app.ga.trackEvent("新聞アプリ/全ページ共通", "ヘッダ部メニュー内の項目「バックナンバー」","");
        },
        onClickSetting : function(evt) {
            app.ga.trackEvent("新聞アプリ/全ページ共通", "ヘッダ部メニュー内の項目「設定」","");
        },

        /**
         * ルーティングによって呼ばれる
         *
         * @param {Event} ev
         */
        onRoute: function (ev) {
            console.log(ev);
        }
    });

    module.exports = GlobalNavView;
});
