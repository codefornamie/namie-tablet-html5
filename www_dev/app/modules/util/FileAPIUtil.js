define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var FileAPIUtil = function() {

    };
    FileAPIUtil.isSupported = function() {
        return window.File && window.FileReader && window.FileList && window.Blob;
    };

    FileAPIUtil.createObjectURL = function(file) {
        app.logger.debug("createObjectURL: file: " + file);
        if (window.webkitURL) {
            app.logger.debug("window.webkitURL: true");
            return window.webkitURL.createObjectURL(file);
        } else if (window.URL && window.URL.createObjectURL) {
            app.logger.debug("window.webkitURL: false");
            return window.URL.createObjectURL(file);
        } else {
            return null;
        }
    };
    FileAPIUtil.bindFileInputImpl = function(el, preview){
        var self = this;
        // 動作プラットフォーム判定
        document.addEventListener("deviceready", function(e){
            //var Camera = navigator.camera;
            app.logger.debug("deviceready!!!: " + el.attr("type"));
            app.logger.debug("Camera: " + Camera);
            el.attr("type", "button");
            el.on("click", function(e){
                var target = e.target;
                navigator.camera.getPicture(function(imageURI){
                    window.resolveLocalFileSystemURL(imageURI, function(fileEntry){
                        app.logger.debug("fileEntry:" + fileEntry);
                        var file = fileEntry.file(function(file){
                            app.logger.debug("file:" + file);
                            var evt = document.createEvent("Event");
                            evt.initEvent("change", true, true);
                            app.logger.debug("evt:" + evt);
                            target.file = file;
                            app.logger.debug("target.files: " + target.file);
                            target.dispatchEvent(evt);
                            app.logger.debug("end");
                        }, function(e){
                            app.logger.debug("FileAPIUtil.bindFileInputImpl: camera.getPicture(): error");
                        });
                    });
                }, function(e){
                    app.logger.debug("FileAPIUtil.bindFileInputImpl: getPicture(): error");
                },{
                    quality : 50,
                    destinationType : Camera.DestinationType.FILE_URI,
                    sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
                    correctOrientation : true
                });
            });
        });
    };
    FileAPIUtil.bindFileInput = function(el, preview){
        FileAPIUtil.bindFileInputImpl(el);
    };

    module.exports = FileAPIUtil;
});
