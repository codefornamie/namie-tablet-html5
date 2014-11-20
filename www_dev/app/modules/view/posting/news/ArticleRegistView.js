define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var EventsModel = require("modules/model/events/EventsModel");
    var FileAPIUtil = require("modules/util/FileAPIUtil");


    var ArticleRegistView = AbstractView.extend({
        template : require("ldsh!templates/{mode}/news/articleRegist"),
        model : new EventsModel(),
        /**
         * フォーム要素のID
         */
        formId : '#articleRegistForm',
        /**
         * 画像名
         */
        fileName : '',

        beforeRendered : function() {

        },

        afterRendered : function() {
            this.chageMultiDateCheckbox();
        },

        initialize : function() {
        },

        events : {
            "change #articleMultiDate" : "chageMultiDateCheckbox"
        },
        setSelectOption: function() {
            var thisYear = new Date().getFullYear();
            // 年コンボの生成
            for ( var i = -1; i <= 1; i++) {
                $('#registYearSelect').append($('<option />').attr({
                    value : (thisYear + i).toString()
                }).text((thisYear + i).toString()));
            }
            // 月コンボの生成
            for (var j = 1;j <= 12; j++) {
                $('#registMonthSelect').append($('<option />').attr({
                    value : j.toString()
                }).text(j.toString()));
            }
            // 日コンボの生成
            for (var k = 1;k <= 31; k++) {
                $('#registDateSelect').append($('<option />').attr({
                    value : k.toString()
                }).text(k.toString()));
            }
            
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
        chageMultiDateCheckbox : function (){
            if($("#articleMultiDate").is(":checked")){
                $(".articleDateTo").show();
            }else{
                $(".articleDateTo").hide();
            }
        },
        onClickEventRegistButton : function () {
            if ($(this.formId).validate().form()) {
                this.showLoading();
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
                var self = this;
                this.model.save(null,{
                    success: function() {
                        setTimeout(function () {
                            self.hideLoading();
                            app.router.go("eventsRegisted");
                        }, 1000);
                    }
                });
            } catch (e) {
                return;
            }
        },

    });
    module.exports = ArticleRegistView;
});
