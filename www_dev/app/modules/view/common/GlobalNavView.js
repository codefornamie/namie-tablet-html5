/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* jshint eqnull:true */

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var DateUtil = require("modules/util/DateUtil");
    var AbstractView = require("modules/view/AbstractView");
    var ModalCalendarView = require("modules/view/news/common/ModalCalendarView");
    var TutorialView = require("modules/view/tutorial/TutorialView");
    var PersonalModel = require("modules/model/personal/PersonalModel");
    var Snap = require("snap");

    var GlobalNavView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/common/global-nav"),
        templateMap : {
            "news" : require("ldsh!templates/news/common/global-nav")
        },

        /**
         * 文字サイズ変更後のタイマー
         */
        fontTimer : null,

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
            var self = this;

            this.updateBackHomeButton();
            this.updateDateLabel();
            var $target = $("[value='" + app.user.get("fontSize") + "']");
            var size = parseInt($target.attr('data-font-size'), 10);
            $('html, body').css('font-size', size + 'px');
            this.setDate(this.targetDate || new Date(app.currentDate));
        },

        /**
         *  初期化処理
         *  @memberOf GlobalNavView#
         */
        initialize : function() {
            var self = this;

            // snap.jsを初期化する
            this.snapper = new Snap({
                element: $('#snap-content')[0],
                tapToClose: true,
                touchToDrag: false
            });
            $('#snap-content').data("snap",this.snapper);

            // ルーティングのイベントハンドラを登録する
            app.router.on('route:globalNav', this.onRoute.bind(this));

            // プレビューモードの場合は自身を表示しない
            if (app.preview) {
                $(".contents-wrapper").css("padding-top", "0");
                $("#global-nav").hide();
            }

            // TODO appに刺さない
            $(document).on("backnumber-date", function (ev, data) {
                app.backnumberDateAreaHtml = data.dateAreaHtml;

                $('.global-nav__date .nav-content').empty().html(app.backnumberDateAreaHtml);
            });
        },

        /**
         *  viewがremoveされる時に呼ばれる
         *  @memberOf GlobalNavView#
         */
        cleanup: function () {
            app.router.off('route:globalNav');
        },

        /**
         * RadiationエンティティセットへのFetch成功時のイベントハンドラ。
         * @memberOf GlobalNavView#
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
            'click #setting' : 'onClickSetting',
            "click #calendar" : "onClickCalendar"
        },


        /**
         * 発行日を設定する。
         * @memberOf GlobalNavView#
         * @param {Date} date 設定する日付
         */
        setDate : function(date) {
            if (date) {
                $("#naviPublishDate").show();
                $("#naviPublishDate").find(".date--year").text(DateUtil.formatDate(date, "yyyy"));
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
         *  @memberOf GlobalNavView#
         */
        updateBackHomeButton: function () {
            var fragment = Backbone.history.fragment;

            if (fragment && fragment.match(/^top/)) {
                $('.global-nav__menu').hide();
                $('.global-nav__date').addClass('no-backbutton');
            } else {
                $('.global-nav__menu').show();
                $('.global-nav__date').removeClass('no-backbutton');
            }
        },

        /**
         *  日付の表記を変更
         *  @memberOf GlobalNavView#
         */
        updateDateLabel: function () {
            var self = this;
            var fragments = Backbone.history.fragment.split('/');
            if (fragments[0] == 'backnumber') {
                //$('.global-nav__date .nav-content').html('バックナンバー');
                if (app.backnumberDateAreaHtml) $('.global-nav__date .nav-content').empty().html(app.backnumberDateAreaHtml);
            }
        },

        /**
         *  サンドイッチボタンがクリックされたら呼ばれる
         *  @memberOf GlobalNavView#
         *  @param {Event} ev
         */
        onClickDrawerOpener: function (ev) {
            app.ga.trackEvent("全ページ共通", "ヘッダ部メニュー","");
            ev.preventDefault();
            this.snapper.open('left');
        },

        /**
         *  今日の新聞に戻るボタンが押されたら呼ばれる
         *  @memberOf GlobalNavView#
         */
        onClickBackHome: function (ev) {
            ev.preventDefault();
            app.router.back();
        },

        /**
         *  フォントサイズ変更ボタンが押されたら呼ばれる
         *  @memberOf GlobalNavView#
         */
        onClickFontSize: function (ev) {
            $(document).trigger('willChangeFontSize');

            var $target = $(ev.currentTarget);
            var size = parseInt($target.attr('data-font-size'), 10);
            app.ga.trackEvent("全ページ共通", "文字サイズ選択", parseInt(size));
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
         *  @memberOf GlobalNavView#
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
            $('#snap-content').data("snap").close();
        },

        /**
         * ヘルプがクリックされたら呼ばれる
         * @memberOf GlobalNavView#
         */
        onClickHelp : function(evt) {
            app.ga.trackEvent("全ページ共通", "ヘッダ部メニューボタンの項目押下「ヘルプ」","");

            var tutorialView = new TutorialView();

            this.setView(GlobalNavView.SELECTOR_GLOBAL_HELP, tutorialView);
            this.listenTo(tutorialView, "closeGlobalHelp", function () {
                tutorialView.remove();
                // URLを元に戻す
                app.router.back();
            });
            tutorialView.render();

            // ヘルプ画面用URLに遷移
            app.router.navigate("help", {
                trigger: true,
                replace: false
            });
        },

        /**
         * バックナンバーがクリックされたら呼ばれる
         * @memberOf GlobalNavView#
         */
        onClickBackno : function(evt) {
            app.ga.trackEvent("全ページ共通", "ヘッダ部メニュー内の項目「バックナンバー」","");
        },
        /**
         * 設定がクリックされたら呼ばれる
         * @memberOf GlobalNavView#
         */
        onClickSetting : function(evt) {
            app.ga.trackEvent("全ページ共通", "ヘッダ部メニュー内の項目「設定」","");
        },

        /**
         * カレンダーがクリックされたら呼ばれる
         * @memberOf GlobalNavView#
         */
        onClickCalendar : function (evt) {
            app.ga.trackEvent("全ページ共通", "ヘッダ部メニューボタンの項目押下「過去の新聞を読む」","");

            var modalCalendarView = new ModalCalendarView();

            this.setView(GlobalNavView.SELECTOR_MODAL_CALENDAR, modalCalendarView);
            this.listenTo(modalCalendarView, "closeModalCalendar", function () {
                modalCalendarView.remove();
                // URLを元に戻す
                app.router.back();
            });
            modalCalendarView.render();

            // カレンダー画面用URLに遷移
            app.router.navigate("calendar", {
                trigger: true,
                replace: false
            });
        },

        /**
         * ルーティングによって呼ばれる
         *
         * @memberOf GlobalNavView#
         * @param {Event} ev
         */
        onRoute: function (ev) {
            app.logger.debug(ev);
        }
    }, {
        /**
         * modal-calendarを挿入する部分のセレクタ
         */
        SELECTOR_MODAL_CALENDAR: "#modal-calendar-container",

        /**
         * ヘルプを挿入する部分のセレクタ
         */
        SELECTOR_GLOBAL_HELP: "#global-help-container"
    });

    module.exports = GlobalNavView;
});
