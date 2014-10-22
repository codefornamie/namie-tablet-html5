define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var EventsModel = require("modules/model/events/EventsModel");
    var FileAPIUtil = require("modules/util/FileAPIUtil");


    var EventsView = AbstractView.extend({
        template : require("ldsh!/app/templates/events/events"),
        model : new EventsModel(),
        /**
         * フォーム要素のID
         */
        formId : '#eventsRegistForm',
        /**
         * 画像名
         */
        fileName : '',

        beforeRendered : function() {

        },

        afterRendered : function() {
        },

        initialize : function() {

        },

        events : {
            "change #eventFile" : "onChangeFileData",
            "click #eventRegistButton" : "onClickEventRegistButton",
            "click #fileInputButton" : "onClickFileInputButton",
            "click #fileDeleteButton" : "onClickFileDeleteButton"
        },
        onClickFileInputButton:function () {
          $("#eventFile")[0].click();  
        },
        onChangeFileData : function (event) {
            var files = event.target.files;// FileList object
            var file = files[0];

            if (!file) {
                $('#previewFile').hide();
                $("#fileDeleteButton").hide();
                return;
            }

          // Only process image files.
          if (!file.type.match('image.*')) {
            return;
          }

          $('#previewFile').attr("src", FileAPIUtil.createObjectURL(file));
          $('#previewFile').show();
          $("#fileDeleteButton").show();
        },
        onClickFileDeleteButton : function () {
            $("#eventFile").val("");
            $("#previewFile").attr("src","");
            $("#previewFile").hide();
            $("#fileDeleteButton").hide();
        },
        onClickEventRegistButton : function () {
            if ($(this.formId).validate().form()) {
                this.onSubmit();
            }
        },
        setInputValue : function () {
            this.model.set("eventDate",$("#eventDatetime").val().split("T")[0]);
            this.model.set("eventTime",$("#eventDatetime").val().split("T")[1]);
            this.model.set("eventName",$("#eventName").val());
            this.model.set("eventPlace",$("#eventPlace").val());
            this.model.set("eventDetail",$("#eventDetail").val());
            this.model.set("eventTel",$("#eventTel").val());
            this.model.set("eventEmail",$("#eventEmail").val());
            this.model.set("fileName",this.fileName);
        },
        /**
         * 添付された画像をdavへ登録する
         */
        saveEventPicture : function() {
          var reader = new FileReader();
          var contentType = "";
          reader.onload = $.proxy(function(fileEvent) {
              var options = {
                      body : fileEvent.currentTarget.result,
                      headers : {
                          "Content-Type":contentType,
                          "If-Match":"*"
                      }
              };
              app.box.col("dav").put(this.fileName,options);
          },this);
          // Read in the image file as a data URL.
          var file = $("#eventFile").prop("files")[0];
          contentType = file.type; 
          var preName = file.name.substr(0,file.name.lastIndexOf("."));
          var suffName = file.name.substr(file.name.lastIndexOf("."));
          this.fileName = preName + "_" + String(new Date().getTime()) + suffName; 
          reader.readAsArrayBuffer(file);
        },
        /**
         * バリデーションチェックがOKとなり、登録処理が開始された際に呼び出されるコールバック関数。
         */
        onSubmit : function() {
            try {
                // 登録処理を開始する
                if ($('#previewFile').attr("src")) {
                    this.saveEventPicture();
                }
                this.setInputValue();
                this.model.save();
            } catch (e) {
                return;
            }
        },

    });
    module.exports = EventsView;
});
