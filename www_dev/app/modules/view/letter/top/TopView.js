define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var moment = require("moment");
    var AbstractView = require("modules/view/AbstractView");
    var LetterSelectView = require("modules/view/letter/select/LetterSelectView");
    var LetterListView = require("modules/view/letter/top/LetterListView");
    var LetterWizardView = require("modules/view/letter/wizard/LetterWizardView");
    var LetterWizardCompleteView = require("modules/view/letter/wizard/LetterWizardCompleteView");
    var LetterEditView = require("modules/view/letter/edit/LetterEditView");
    var LetterEditCompleteView = require("modules/view/letter/edit/LetterEditCompleteView");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var BusinessUtil = require("modules/util/BusinessUtil");
    var Equal = require("modules/util/filter/Equal");
    var Ge = require("modules/util/filter/Ge");
    var Le = require("modules/util/filter/Le");
    var And = require("modules/util/filter/And");
    var IsNull = require("modules/util/filter/IsNull");
    var Code = require("modules/util/Code");
    var vexDialog = require("vexDialog");

    /**
     * 町民投稿アプリのトップ画面を表示するためのLayoutクラスを作成する。
     * @class
     * @constructor
     */
    var LetterTopLayout = AbstractView.extend({
        /**
         * このLayoutのテンプレートファイルパス
         * @memberOf LetterTopLayout#
         */
        template : require("ldsh!templates/{mode}/top/top"),

        /**
         * イベント一覧
         * @memberOf LetterTopLayout#
         */
        events : {
            "click a" : "onClickAnchor"
        },

        /**
         * 初期化
         * @param {Object} param
         * @memberOf LetterTopLayout#
         */
        initialize : function(param) {
            console.assert(param, "param should be specified");
            console.assert(param.letterListView, "param.letterListView should be specified");

            this.letterListView = param.letterListView;
        },

        /**
         * 遷移先選択画面を開く
         * @memberOf LetterTopLayout#
         */
        showSelect : function() {
            var letterSelectView = new LetterSelectView();

            this.removeView(LetterTopLayout.SELECTOR_LETTER_WIZARD);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_WIZARD_COMPLETE);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_EDIT);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_LIST);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_EDIT_COMPLETE);
            this.setView(LetterTopLayout.SELECTOR_LETTER_SELECT, letterSelectView);
        },

        /**
         * 一覧画面を開く
         * @memberOf LetterTopLayout#
         */
        showList : function() {
            this.removeView(LetterTopLayout.SELECTOR_LETTER_SELECT);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_WIZARD);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_WIZARD_COMPLETE);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_EDIT);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_EDIT_COMPLETE);
            this.setView(LetterTopLayout.SELECTOR_LETTER_LIST, this.letterListView);
        },

        /**
         * ウィザード画面を開く
         * @param {Number} step
         * @memberOf LetterTopLayout#
         */
        showWizard : function(step) {
            var isRendered = !!this.getView(LetterTopLayout.SELECTOR_LETTER_WIZARD);

            // レンダリング済みならば何もしない
            if (!isRendered) {
                var letterWizardView = new LetterWizardView();

                this.removeView(LetterTopLayout.SELECTOR_LETTER_SELECT);
                this.removeView(LetterTopLayout.SELECTOR_LETTER_WIZARD_COMPLETE);
                this.removeView(LetterTopLayout.SELECTOR_LETTER_LIST);
                this.removeView(LetterTopLayout.SELECTOR_LETTER_EDIT);
                this.removeView(LetterTopLayout.SELECTOR_LETTER_EDIT_COMPLETE);
                this.setView(LetterTopLayout.SELECTOR_LETTER_WIZARD, letterWizardView);
            }
        },

        /**
         * ウィザード完了画面を開く
         * @memberOf LetterTopLayout#
         */
        showWizardComplete : function(id) {
            var letterWizardCompleteView = new LetterWizardCompleteView();

            this.removeView(LetterTopLayout.SELECTOR_LETTER_SELECT);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_LIST);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_WIZARD);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_EDIT);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_EDIT_COMPLETE);
            this.setView(LetterTopLayout.SELECTOR_LETTER_WIZARD_COMPLETE, letterWizardCompleteView);
        },

        /**
         * 編集画面を開く
         * @param {String} id 編集する記事のID
         * @memberOf LetterTopLayout#
         */
        showEdit : function(id) {
            console.assert(_.isString(id), "id should be a string");

            var letterEditView = new LetterEditView();

            this.removeView(LetterTopLayout.SELECTOR_LETTER_SELECT);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_LIST);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_WIZARD);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_WIZARD_COMPLETE);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_EDIT_COMPLETE);
            this.setView(LetterTopLayout.SELECTOR_LETTER_EDIT, letterEditView);
        },

        /**
         * 編集完了画面を開く
         * @param {String} id 編集した記事のID
         * @memberOf LetterTopLayout#
         */
        showEditComplete : function(id) {
            console.assert(_.isString(id), "id should be a string");

            var letterEditCompleteView = new LetterEditCompleteView();

            this.removeView(LetterTopLayout.SELECTOR_LETTER_SELECT);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_LIST);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_WIZARD);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_WIZARD_COMPLETE);
            this.removeView(LetterTopLayout.SELECTOR_LETTER_EDIT);
            this.setView(LetterTopLayout.SELECTOR_LETTER_EDIT_COMPLETE, letterEditCompleteView);
        },

        /**
         * aタグをクリックした際の挙動を ブラウザデフォルトではなく pushStateに変更する
         * @memberOf LetterTopLayout#
         */
        onClickAnchor : function(evt) {
            evt.preventDefault();
            if(evt.currentTarget.id !== "post_new_letter") {
                // 新規投稿ボタン以外は、そのまま画面遷移する。
                this.followAnchor(evt);
                return;
            }
            // 新規投稿ボタンの場合、遷移する前に自身の本日中の投稿数制限にかかっていないかをチェックする必要がある。
            // PIOへ本日分の記事を検索する
            var articleCollection = new ArticleCollection();
            var prePublishedAt = BusinessUtil.getCurrentPublishDate();
            var dateString = moment(prePublishedAt).add(1, "d").format("YYYY-MM-DD");
            articleCollection.condition.top = Code.LETTER_PUBLISH_LIMIT;
            articleCollection.condition.filters = [
                    new Equal("publishedAt", dateString),
                    new Equal("type", Code.ARTICLE_CATEGORY_LIST_BY_MODE[Code.APP_MODE_LETTER]),
                    new Equal("createUserId", app.user.get("__id")), new IsNull("deletedAt")
            ];

            this.showLoading();
            articleCollection.fetch({
                cache : false,
                success : $.proxy(function() {
                    this.hideLoading();
                    // 検索にヒットした件数が3件以上の場合は投稿させない
                    if (articleCollection.length >= Code.LETTER_PUBLISH_LIMIT) {
                        vexDialog.defaultOptions.className = 'vex-theme-default vex-theme-letter';
                        vexDialog.buttons.YES.text = 'OK';
                        vexDialog.alert("一日に投稿できる件数は" + Code.LETTER_PUBLISH_LIMIT + "件までです。");
                        return;
                    }
                    // 画面遷移を行う
                    this.followAnchor(evt);
                }, this),
                error : $.proxy(function onErrorLoadArticle() {
                    app.logger.error("Articleの読み込みに失敗。");
                    vexDialog.defaultOptions.className = 'vex-theme-default vex-theme-letter';
                    vexDialog.buttons.YES.text = 'OK';
                    vexDialog.alert("情報の読み込みに失敗しました。");
                    this.hideLoading();
                }, this)
            });
        }
    }, {
        /**
         * 遷移先選択画面
         */
        SELECTOR_LETTER_SELECT : "#letter-select-container",

        /**
         * ユーザーが投稿した記事一覧のセレクタ
         */
        SELECTOR_LETTER_LIST : "#letter-list-container",

        /**
         * ウィザード画面のセレクタ
         */
        SELECTOR_LETTER_WIZARD : "#letter-wizard-container",

        /**
         * ウィザード完了画面のセレクタ
         */
        SELECTOR_LETTER_WIZARD_COMPLETE : "#letter-wizard-complete-container",

        /**
         * 編集画面のセレクタ
         */
        SELECTOR_LETTER_EDIT : "#letter-edit-container",

        /**
         * 編集完了画面のセレクタ
         */
        SELECTOR_LETTER_EDIT_COMPLETE : "#letter-edit-complete-container"
    });

    /**
     * 町民投稿アプリのトップ画面を表示するためのViewクラスを作成する。
     * 
     * @class 町民投稿アプリのトップ画面を表示するためのView
     * @exports LetterTopView
     * @constructor
     */
    var LetterTopView = AbstractView.extend({
        /**
         * 初期化
         * @memberOf LetterTopView#
         * @param {Object} param
         */
        initialize : function(param) {
            this.initCollection();
            this.initLayout();
            this.initEvents();
        },

        /**
         * コレクションを初期化する
         * @memberOf LetterTopView#
         */
        initCollection : function() {
            // 直近１ヶ月分を表示する
            var dateFrom = moment().subtract(1, "month").format("YYYY-MM-DD");
            var dateTo = moment().add(1, "d").format("YYYY-MM-DD");

            if (!this.letterCollection) {
                this.letterCollection = new ArticleCollection();
            }

            this.letterCollection.condition.filters = [
                    new Ge("publishedAt", dateFrom), new Le("publishedAt", dateTo),
                    new Equal("type", Code.ARTICLE_CATEGORY_LIST_BY_MODE[Code.APP_MODE_LETTER]),
                    new Equal("createUserId", app.user.get("__id")), new IsNull("deletedAt")
            ];

            this.letterCollection.fetch();
        },

        /**
         * layoutを初期化する
         * @memberOf LetterTopView#
         */
        initLayout : function() {
            this.letterListView = new LetterListView({
                collection : this.letterCollection
            });

            this.layout = new LetterTopLayout({
                letterListView : this.letterListView
            });
        },

        /**
         * イベントを初期化する
         * @memberOf LetterTopView#
         */
        initEvents : function() {
            this.listenTo(app.router, "route", this.onRoute);
            this.listenTo(this.letterCollection, "sync", this.onSyncLetter.bind(this));
            this.listenTo(this.letterCollection, "error", this.onErrorLetter.bind(this));
        },

        /**
         * ルーティングを監視して描画処理を行う
         * @memberOf LetterTopView#
         * @param {String} route
         * @param {Object} params
         */
        onRoute : function(route, params) {
            var id;

            switch (route) {
            case "letterSelect":
                this.layout.showSelect();
                break;

            case "letterList":
                this.layout.showList();
                break;

            case "letterDetail":
                break;

            case "letterEdit":
                id = params[0];
                this.layout.showEdit(id);
                break;

            case "letterEditComplete":
                id = params[0];
                this.layout.showEditComplete(id);
                break;

            case "letterWizard":
                this.showLoading();
                var queryString = params[1];
                var query = app.router.parseQueryString(queryString);
                var step = query.step;

                this.layout.showWizard(step);
                break;

            case "letterWizardComplete":
                this.layout.showWizardComplete();
                break;

            default:
                break;
            }

            this.layout.render();
        },

        /**
         * 記事一覧が読み込まれたら呼ばれる
         * @memberOf LetterTopView#
         */
        onSyncLetter : function() {
            this.layout.render();
            // 削除後レンダリング時の要素非表示処理
            var listViewLayout = this.layout.getView("#letter-list-container");
            var listItems = [];
            if (listViewLayout) {
                listItems = listViewLayout.getViews("#letter-list") ? listViewLayout.getViews("#letter-list").value() : [];
            }
            var deletedItems = _.filter(listItems, function(item) {
                return item.model.get("isDeleted");
            });
            if (deletedItems.length > 0) {
                _.each(deletedItems, function(deleteItem) {
                    $(deleteItem.el).hide();
                });
            }
            this.hideLoading();
        },

        /**
         * 記事一覧の読み込みに失敗したら呼ばれる
         * @memberOf LetterTopView#
         */
        onErrorLetter : function() {
            alert("記事一覧の取得に失敗しました");
            app.logger.error("記事一覧の取得に失敗しました");
            this.hideLoading();
        }
    });

    module.exports = LetterTopView;
});
