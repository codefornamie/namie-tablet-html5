define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var DojoListView = require("modules/view/dojo/top/DojoListView");
    var DojoEditionModel = require("modules/model/dojo/DojoEditionModel");
    var Code = require("modules/util/Code");

    /**
     * 道場アプリのコース内コンテンツ一覧画面のLayout
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @constructor
     */
    var DojoLevelLayout = Backbone.Layout.extend({
        /**
         * このViewのテンプレートファイルパス
         * @memberOf DojoLevelView#
         */
        template : require("ldsh!templates/{mode}/top/dojoLevel"),

        /**
         * テンプレートに渡す情報をシリアライズする
         * @return {Object}
         */
        serialize : function() {
            return {
                dojoLevel: Code.DOJO_LEVELS[this.level.get("level")]
            };
        },

        /**
         * 初期化
         * @param {Object} param
         * @memberOf DojoLevelView#
         */
        initialize : function(param) {
            console.assert(param, "param should be specified");
            console.assert(param.dojoEditionModel, "param.dojoEditionModel should be specified");

            this.dojoEditionModel = param.dojoEditionModel;
        },

        /**
         * Layoutの描画処理の開始前に呼び出されるコールバック関数。
         * <p>
         * 記事一覧の表示処理を開始する。
         * </p>
         * @memberOf DojoLevelView#
         */
        beforeRender : function() {
        },

        /**
         * Layoutの描画処理の終了後に呼び出されるコールバック関数。
         * @memberOf DojoLevelView#
         */
        afterRender : function() {
            if (this.dojoEditionModel && this.dojoEditionModel.get("contentCollection")) {
                this.updateNumberOfContent(this.dojoEditionModel);

                var dojoListView = new DojoListView({
                    //collection: this.dojoEditionModel.get("contentCollection"),
                    dojoEditionModel: this.dojoEditionModel,
                    level: this.level
                });

                this.setView("#dojo-level-list-container", dojoListView).render();
            }
        },

        /**
         * 道場コンテンツの視聴状況を描画する
         * @param {DojoEditionModel} edition
         * @memberOf DojoLevelView#
         */
        updateNumberOfContent : function(edition) {
            var contents = this.dojoEditionModel.getModelsByLevel(this.level.get("level"));
            var numSolved = 0;
            _.each(contents, function (content) {
                if (content.getSolvedState() === Code.DOJO_STATUS_SOLVED) {
                    numSolved++;
                }
            });
            var numContent = contents.length;
            this.$el.find("[data-content-num]").text(numContent);
            if (numContent - numSolved === 0) {
                this.$el.find("[data-remained-num]").text("段位達成！！");
            } else {
                this.$el.find("[data-remained-num]").text("あと" + (numContent - numSolved) + "本で段位取得！！");
            }
        }
    });

    /**
     * 道場アプリのトップ画面を表示するためのViewクラスを作成する。
     * 
     * @class 道場アプリのトップ画面を表示するためのView
     * @exports DojoLevelView
     * @constructor
     */
    var DojoLevelView = AbstractView.extend({
        /**
         * 初期化
         * @param {Object} param 初期化処理オブション情報
         * @memberOf DojoLevelView#
         */
        initialize : function(param) {
            console.assert(param, "param should be specified");
            console.assert(param.dojoEditionModel, "param.dojoEditionModel should be specified");

            this.model = new Backbone.Model();
            this.layout = new DojoLevelLayout({
                dojoEditionModel: param.dojoEditionModel
            });
            
            this.initEvent();
        },

        /**
         * イベントを初期化する
         * @memberOf DojoLevelView#
         */
        initEvent: function () {
            this.listenTo(this.model, "change:level", this.onChangeLevel);
        },

        /**
         * レベルが変更されたら呼ばれる
         * @param {String} level
         * @memberOf DojoLevelView#
         */
        onChangeLevel: function (level) {
            this.layout.level = level;
        }
    });

    module.exports = DojoLevelView;
});
