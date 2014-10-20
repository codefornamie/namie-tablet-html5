define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var YouTubeView = require("modules/view/top/YouTubeView");

    var TopView = AbstractView.extend({
        template : require("ldsh!/app/templates/top/top"),

        beforeRendered : function() {

        },

        afterRendered : function() {

        },
        /**
         * 初期化処理
         */
        initialize : function() {
            if (app.gapiLoaded) {
                var youTubeView = new YouTubeView();
                this.setView(".youtube", youTubeView).render();
                youTubeView.show();
                return;
            }
            var self = this;
            window.googleApiClientReady = function() {
                delete window.googleApiClientReady;

                window.onYouTubeIframeAPIReady = function() {
                    delete window.onYouTubeIframeAPIReady;
                    app.gapiLoaded = true;
                    var youTubeView = new YouTubeView();
                    self.setView(".youtube", youTubeView).render();
                    youTubeView.show();
                };

                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            };

            var tag = document.createElement('script');
            tag.src = "https://apis.google.com/js/client.js?onload=googleApiClientReady";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    });

    module.exports = TopView;
});
