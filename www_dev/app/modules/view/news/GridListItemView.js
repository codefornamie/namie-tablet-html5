define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var FeedListItemView = require("modules/view/news/FeedListItemView");
    var Code = require("modules/util/Code");
    var Super = FeedListItemView;

    /**
     * 記事一覧アイテム(メニュー用)のViewを作成する。
     * 
     * @class 記事一覧アイテム(メニュー用)のView
     * @exports GridListItemView
     * @constructor
     */
    var GridListItemView = FeedListItemView.extend({
        /**
         * このViewのテンプレートファイパス
         */
        template : require("ldsh!templates/news/news/gridListItem"),

        /**
         * ViewのテンプレートHTMLの描画処理が完了する前に呼び出される。
         * @memberOf GridListItemView#
         */
        beforeRendered : function() {
            this.$el.addClass("grid-list-item-div");
        },

        /**
         * ViewのテンプレートHTMLの描画処理が完了した後に呼び出される。
         * <p>
         * 記事に関連する画像ファイルの取得と表示を行う。
         * </p>
         * @memberOf GridListItemView#
         */
        afterRendered : function() {
            var self = this;
            var eventId = "ev-" + this.cid;
            var imageType = this.model.getImageType();

            // 画像URLがない場合は、画像のエリアをつめる
            // 画像URLがある場合は、画像読み込みに失敗したら画像のエリアをつめる
            if (imageType === Code.IMAGE_TYPE_NONE) {
                this.$el.find(".grid-list__item").addClass("is-no-image");
                self.$el.trigger("imageError");
            } else {
                this.$el.find(".articleImage")
                .on("center", function () {
                    var $this = $(this);
                    var $container = $this.parent();

                    // 画像を水平中央に寄せる
                    var width = $this.width();
                    var containerWidth = $container.outerWidth();

                    // 画像を垂直中央に寄せる
                    var height = $this.height();
                    var containerHeight = $container.outerHeight();

                    var top;
                    var left;

                    // 初期状態ではみだすかどうか判定し
                    // 水平中央寄せか垂直中央寄せか決める
                    if (containerWidth < width) {
                        top = 0;
                        left = containerWidth / 2 - width / 2;
                    } else {
                        $this
                        .css({
                            width: "100%",
                            height: "auto"
                        });

                        height = $this.height();

                        top = containerHeight / 2 - height / 2;
                        left = 0;
                    }

                    $this
                    .css({
                        top: top,
                        left: left
                    });
                })
                .on("load", function () {
                    var el = this;

                    $(el).triggerHandler("center");

                    $(window).on("resize." + eventId, function () {
                        $(el).triggerHandler("center");
                    });
                })
                .on("error", function() {
                    self.$el.find(".grid-list__item").addClass("is-no-image");

                    // 画像読み込み失敗によってレイアウトが変化することを
                    // 親のviewに伝えるため、イベントをトリガする
                    self.$el.trigger("imageError");
                });
            }

            Super.prototype.afterRendered.call(this);
        },

        /**
         * viewが破棄される時に呼ばれる
         * @memberOf GridListItemView#
         */
        cleanup: function () {
            var eventId = "ev-" + this.cid;

            $(window).off("resize." + eventId);
        }
    });

    module.exports = GridListItemView;
});
