/* global Nehan */
define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    require("nehan");
    var AbstractView = require("modules/view/AbstractView");
    
    var EventsDetailView = AbstractView.extend({
        template : require("ldsh!/app/templates/events/eventsDetail"),
        serialize : function() {
            return {
                model : this.model
            };
        },
        beforeRendered : function() {

        },

        afterRendered : function() {
            // data-nehan属性を持つ要素全てに
            // nehan.jsを適用する
            this.$el.find('[data-nehan]')
                .each(function () {
                    var $el = $(this);

                    var engine = Nehan.setup({
                        layout: {
                            "flow": "tb-rl",
                            "width": 600,
                            "height": 600,
                            fontSize: 32
                        }
                    });
                    
                    var content = $el.html();

                    $el.empty();
                    
                    engine
                        .createPageStream(content)
                        .asyncGet({
                            onProgress: function (stream, tree) {
                                var page = stream.getPage(tree.pageNo);

                                $el.append(page.element);
                            }
                        });
                });
        },
        /**
         * 初期化処理
         */
        initialize : function() {

        }

    });

    module.exports = EventsDetailView;
});
