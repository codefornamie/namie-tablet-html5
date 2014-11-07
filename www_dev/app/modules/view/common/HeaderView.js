/* jshint eqnull:true */

define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var AbstractView = require("modules/view/AbstractView");
    var Snap = require("snap");
    var RadiationModel = require("modules/model/radiation/RadiationModel");
    var RadiationCollection = require("modules/collection/radiation/RadiationCollection");
    var Equal = require("modules/util/filter/Equal");
    
    var HeaderView = AbstractView.extend({
        template : require("ldsh!/app/templates/common/header"),
        model : new RadiationModel(),
        collection : new RadiationCollection(),

        beforeRendered : function() {
        },

        afterRendered : function() {
            this.collection.fetch({success: $.proxy(this.onFetchRadiation,this)});
        },

        initialize : function() {
            this.snapper = new Snap({
                element: document.getElementById('snap-content'),
                tapToClose: true,
                touchToDrag: false
            });
        },

        /**
         * RadiationエンティティセットへのFetch成功時のイベントハンドラ。
         */
        onFetchRadiation: function() {
            var model = this.collection.at(0);
            var value = "-";
            if (model) {
                value = model.get("value");
            }
            $("#radiationValue").text(value + "μSv/h");
        },

        events : {
            'click [data-drawer-opener]': 'onClickDrawerOpener',
            'change #selectRadiation' : "onChangeRadiationStation"
        },

        /**
         *  サンドイッチボタンがクリックされたら呼ばれる
         */
        onClickDrawerOpener: function () {
            this.snapper.open('left');
        },

        /**
         * 放射線量の測定地区Selectの選択イベントハンドラ。
         * @param {Object} ev イベントオブジェクト
         */
        onChangeRadiationStation: function(ev) {
            var value = $("#selectRadiation").val();
            //this.collection.condition.filter = "station eq '" + value + "'";
            this.collection.condition.filters = [new Equal("station", value)];
            this.collection.fetch({success: $.proxy(this.onFetchRadiation,this)});
        }
    });

    module.exports = HeaderView;
});
