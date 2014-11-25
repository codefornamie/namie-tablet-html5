/* global IScroll:true */

define(function(require, exports, module) {
    "use strict";
    
    require('iscroll-zoom');

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var ArticleCollection = require("modules/collection/article/ArticleCollection");
    var ArticleListItemView = require("modules/view/news/ArticleListItemView");
    var EventListItemView = require("modules/view/news/EventListItemView");
    var YouTubeListItemView = require("modules/view/news/YouTubeListItemView");

    /**
     * 記事一覧のViewクラス
     */
    var ArticleListView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/news/articleList"),
        
        /**
         * 表示中の記事のID
         */
        _currentArticleId: null,
        
        beforeRendered : function() {
            this.destroyIScroll();
            this.setArticleList();
        },

        afterRendered : function() {
            //this.initIScroll();
            //var $container = $('#contents__primary');
            //this.iscroll = new IScroll($container[0], {
            //    zoom: true
            //});
        },
        /**
         * 初期化処理
         */
        initialize : function() {
            // 表示する記事ページのインデックス
            app.set('currentPage', 0);
            this.listenTo(app, 'change:currentPage', this.onChangeCurrentPage);
            
            // イベントを登録
            app.on('scrollToArticle', this.scrollToArticle.bind(this));
            app.on('willChangeFontSize', this.willChangeFontSize.bind(this));
            app.on('didChangeFontSize', this.didChangeFontSize.bind(this));
        },
        
        /**
         * iScrollを初期化する
         */
        initIScroll: function () {
            var self = this;
            var $container = $('#contents__primary');
            var $img = $container.find('img');
            var count = $img.length;

            $img.each(function () {
                var img = this;

                // すでに読み込まれている場合はカウントを減らす
                if (this.src && this.complete) {
                    $(this).attr({
                        width: this.width,
                        height: this.height
                    });

                    count--;
                    registerIScroll();
                    return;
                }

                // 画像が読み込まれたらカウントを減らす
                $(this)
                    .on('load.iscroll', function () {
                        $(this).attr({
                            width: this.width,
                            height: this.height
                        });

                        count--;
                        registerIScroll();
                    })
                    .on('error.iscroll', function () {
                        count--;
                        registerIScroll();
                    });

                // しばらく読み込まれなかったら無視する
                setTimeout(function () {
                    $(img).off('load.iscroll').off('error.iscroll');

                    count--;
                    registerIScroll();
                }, 5000);
            });

            if ($img.length === 0) {
                registerIScroll();
            }
            
            function registerIScroll() {
                if (count > 0) return;
                
                _initIScroll();

                // 読み込み後のフェードインのため
                $('.article-list').addClass('is-ready');
            }
            
            function _initIScroll() {
                // ページ遷移後はスクロール位置を0にする
                $container.animate({
                    scrollTop: 0
                }, 0);
                
                // iscrollインスタンスを生成する
                self.iscroll = new IScroll($container[0], {
                    scrollbars: true,
                    zoom: true,
                    probeType: 1
                });
                
                // scroll量に従ってページ切り替えを行う
                var SCROLL_BUFFER = 50;

                self.iscroll.on('scroll', function () {
                    var y = self.iscroll.y;
                    var scrollTop = $container.scrollTop();
                    var containerHeight = $container.height();
                    var contentHeight = $container.children().height();
                    var hiddenHeight = contentHeight - (scrollTop + containerHeight);
                    
                    if (0 < y) {
                        if (SCROLL_BUFFER < y) {
                            self.goToPreviousPage();
                        }
                    } else {
                        y = y + hiddenHeight;

                        if (y < -SCROLL_BUFFER) {
                            self.goToNextPage();
                        }
                    }
                });
            }
        },
        
        /**
         * 生成済みのiscrollインスタンスを破棄する
         */
        destroyIScroll: function () {
            if (this.iscroll) {
                this.iscroll.destroy();
                this.iscroll = null;
            }
        },

        /**
         * 指定されたarticleIdの記事までスクロール
         * @param {Object} param
         */
        scrollToArticle: function (param) {
            var articleId = param.articleId;
            var immediate = !!param.immediate;
            var heightTopBar = $('.top-bar').height();
            var heightGlobalNav = $('.global-nav').height();
            var position = $("#" + articleId).offset().top - heightTopBar - heightGlobalNav;
            
            // 現在の記事詳細のスクロール位置と相対位置を加算した箇所までスクロールする
            $(".contents__primary").animate({
                scrollTop : position + $(".contents__primary").scrollTop()
            }, {
                queue : false,
                duration: (immediate) ? 0 : 400
            });
        },
        
        /**
         * 取得した動画一覧を描画する
         */
        setArticleList : function() {
            var currentPage = app.get('currentPage');
            var model = this.collection.at(currentPage);
            
            this.collection.each(function (model) {
                var template = require("ldsh!templates/{mode}/news/articleListItem");
                // 記事一覧に追加するViewクラス。
                // 以下の分岐処理で、対象のデータを表示するViewのクラスが設定される。
                var ListItemView;
                
                switch (model.get("type")) {
                case "2":
                    template = require("ldsh!templates/{mode}/news/youTubeListItem");
                    ListItemView = YouTubeListItemView;
                    break;
                case "3":
                    template = require("ldsh!templates/{mode}/news/eventsDetail");
                    ListItemView = EventListItemView;
                    break;
                case "4":
                    template = require("ldsh!templates/{mode}/news/eventsDetail");
                    ListItemView = EventListItemView;
                    break;
                default:
                    template = require("ldsh!templates/{mode}/news/articleListItem");
                    ListItemView = ArticleListItemView;
                    if (model.get("rawHTML")) {
                        template = require("ldsh!templates/{mode}/news/articleListItemForHtml");
                    } else if (model.get("modelType") === "youtube") {
                        // TODO articleにtypeが全て登録されたら
                        template = require("ldsh!templates/{mode}/news/youTubeListItem");
                        ListItemView = YouTubeListItemView;
                    }
                    break;
                }

                this.insertView("#articleList", new ListItemView({
                    model : model,
                    template: template
                }));
            }.bind(this));

            /*
            var animationDeley = 0;
            this.collection.each($.proxy(function(model) {
                var template = require("ldsh!templates/{mode}/news/articleListItem");
                switch (model.get("modelType")) {
                    case "youtube":
                        template = require("ldsh!templates/{mode}/news/articleListItem");
                        break;
                    case "event":
                        template = require("ldsh!templates/{mode}/news/eventsListItem");
                        break;
                    default:
                        template = require("ldsh!templates/{mode}/news/articleListItem");
                        break;
                }
                this.insertView("#articleList", new ArticleListItemView({
                    model : model,
                    template: template,
                    animationDeley : animationDeley
                }));
                animationDeley += 0.2;
            }, this));
            */
        },
        
        /**
         * 指定したページに移動する
         * @param {Number} page
         */
        goToPage: function (page) {
            // 範囲外ならば移動しない
            if (page < 0) return;
            if (this.collection.length <= page) return;
            
            // 範囲内ならば表示しているページを更新する
            app.set('currentPage', page);
        },
        
        /**
         * 前のページに移動する
         */
        goToPreviousPage: function () {
            var currentPage = app.get('currentPage');
            this.goToPage(currentPage - 1);
        },
        
        /**
         * 次のページに移動する
         */
        goToNextPage: function () {
            var currentPage = app.get('currentPage');
            this.goToPage(currentPage + 1);
        },
        
        /**
         * currentPageが更新されたら呼ばれる
         */
        onChangeCurrentPage: function () {
            this.render();
        },
        
        /**
         * 文字サイズを変更する直前に呼ばれる
         */
        willChangeFontSize: function () {
            var $currentPost = $('.post').filter(function () {
                return 0 <= $(this).position().top + $(this).height();
            }).first();
            
            this._currentArticleId = $currentPost.attr('id');
        },

        /**
         * 文字サイズを変更した直後に呼ばれる
         */
        didChangeFontSize: function () {
            app.trigger('scrollToArticle', {
                articleId: this._currentArticleId,
                immediate: true
            });
        },
    });

    module.exports = ArticleListView;
});
