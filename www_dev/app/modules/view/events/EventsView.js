define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var EventsModel = require("modules/model/events/EventsModel");

    var EventsView = AbstractView.extend({
        template : require("ldsh!/app/templates/events/events"),
        model : new EventsModel(),

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
            "click #fileDeleteBUtton" : "onClickFileDeleteButton"
        },
        onClickFileInputButton:function () {
          $("#eventFile")[0].click();  
        },
        onChangeFileData : function (event) {
            var files = event.target.files;// FileList object
            var file = files[0];

            if (!file) {
                $('#previewFile').hide();
                $("#fileDeleteBUtton").hide();
                return;
            }

          // Only process image files.
          if (!file.type.match('image.*')) {
            return;
          }

          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function(fileEvent) {
              // Render thumbnail.
              $('#previewFile').attr("src", fileEvent.currentTarget.result);
              $('#previewFile').show();
              $("#fileDeleteBUtton").show();
          });
          // Read in the image file as a data URL.
          reader.readAsDataURL(file);
        },
        onClickFileDeleteButton : function () {
            $("#eventFile").val("");
            $("#previewFile").attr("src","");
            $("#previewFile").hide();
            $("#fileDeleteBUtton").hide();
        },
        onClickEventRegistButton : function () {
            //validate
            
            // setInputValue
            this.setInputValue();
            // save
            this.model.save();
        },
        setInputValue : function () {
            this.model.set("eventDate",$("#eventDatetime").val().split("T")[0]);
            this.model.set("eventTime",$("#eventDatetime").val().split("T")[1]);
            this.model.set("eventName",$("#eventName").val());
            this.model.set("eventPlace",$("#eventPlace").val());
            this.model.set("eventDetail",$("#eventDetail").val());
            this.model.set("eventTel",$("#eventTel").val());
            this.model.set("eventEmail",$("#eventEmail").val());
        }
    });
    module.exports = EventsView;
});
