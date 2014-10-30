define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    
    var ArticleListItemView = AbstractView.extend({
        template : require("ldsh!/app/templates/news/articleListItem"),
        serialize : function() {
            return {
                model : this.model
            };
        },
        beforeRendered : function() {

        },

        afterRendered : function() {
            if (this.model.get("imageUrl")) {
                $("#articleDetailImage").attr("src",this.model.get("imageUrl"));
            } else {
                $("#articleDetailImageArea").hide();
            }
            /*
            // 縦書き表示処理
            $(".nehandiv").nehan({
                usePager:false, // if false, pager disabled(append mode)
            direction:"vert", // or "vert"
            hori:"lr-tb",
            vert:"tb-rl", // or "tb-lr"
            fontSize:16,
            rowCount:1, // 1 or 2 available
            colCount:1, // 1 or 2 available
            spacingSize:16,
//            pagerElements:["left-prev", "indicator", "right-next"]
          });
          */
            if (this.model.get("imageUrl")) {
                $("#nehan-articleDetailImage").parent().css("width","auto");
                $("#nehan-articleDetailImage").parent().css("height","auto");
                $("#nehan-articleDetailImage").css("width","auto");
                $("#nehan-articleDetailImage").css("height","auto");
            }
            
            $(".panzoom-elements").panzoom({
                minScale: 1,
                contain: "invert"
            });
        },
        /**
         * 初期化処理
         */
        initialize : function() {

        }

    });

    module.exports = ArticleListItemView;
});
