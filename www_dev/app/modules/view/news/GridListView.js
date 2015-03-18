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
define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Masonry = require("masonry");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var FeedListView = require("modules/view/news/FeedListView");
    var GridListItemView = require("modules/view/news/GridListItemView");
    var Super = FeedListView;
    var LetterListItemView = require("modules/view/news/LetterListItemView");

    /**
     * 記事一覧(メニュー用)のViewクラスを作成する。
     * @class 記事一覧(メニュー用)のViewクラス
     * @exports GridListView
     * @constructor
     */
    var GridListView = FeedListView.extend({
        /**
         * 記事リストの要素を選択するためのセレクタ
         * @memberOf GridListView#
         */
        listElementSelector : "#grid-list",

        /**
         * このViewのテンプレートファイルパス
         * @memberOf GridListView#
         */
        template : require("ldsh!templates/news/news/gridList"),

        /**
         * 記事種別ごとのListItemViewの定義
         * <p>
         * typeとviewをプロパティに持つObjectを指定する。
         * typeで指定した記事の場合、viewプロパティに指定したListItemViewが利用される。
         * </p>
         * @memberOf GridListView#
         */
        customListItemView : [
            {
                "type" : "6",
                "view" : LetterListItemView
            }
        ],
        /**
         * このViewのイベント
         * @memberOf GridListView#
         */
        events : {
            "click [data-grid-list-item]" : "onClickFeedListItem"
        },

        /**
         * Viewの描画処理の前に呼び出されるコールバック関数
         * <p>
         * 記事一覧を表示する処理を行う。
         * </p>
         * @memberOf GridListView#
         */
        beforeRendered : function() {
            this.setFeedList();
        },

        /**
         * Viewの描画処理の後に呼び出されるコールバック関数
         * @memberOf GridListView#
         */
        afterRendered : function() {
            if (this.masonry) {
                this.masonry.destroy();
            }

            var $list = $("#grid-list");
            var $item = $list.children().eq(1);

            this.masonry = new Masonry($list[0], {
                columnWidth : $item[0],
                itemSelector : ".grid-list-item-div",
                transitionDuration : 0
            });
        },

        /**
         * 初期化処理
         * @memberOf GridListView#
         */
        initialize : function() {
            Super.prototype.setFeedListItemViewClass.call(this, GridListItemView);

            this.initEvent();
        },

        /**
         * イベント処理
         * @memberOf GridListView#
         */
        initEvent : function() {
            this.$el.on("imageError", this.onImageError.bind(this));
        },

        /**
         * 子ビューで画像読み込みに失敗したときに呼ばれる
         * 
         * @memberOf GridListView#
         */
        onImageError : _.debounce(function() {
            if (this.masonry) {
                this.masonry.layout();
            }
        }, 100)
    });

    module.exports = GridListView;
});
