define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");

    var MenuView = AbstractView.extend({
        template : require("ldsh!/app/templates/common/menu"),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },

        initialize : function() {
        },

        events : {
            'click a': 'onClickAnchor'
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
                Backbone.history.navigate(href.attr, true);
            }
        }
    });

    module.exports = MenuView;
});
