define(function(require, exports, module) {
  "use strict";

  var Backbone = require("backbone");
  var Layout = require("layoutmanager");
  var dc1 = require("dc1-client");
  var jqueryvalidation = require("jqueryvalidation");
  var nehan = require("jquerynehan");
  var blockui = require("blockui");
  var panzoom = require("panzoom");


//  var messageja = require("messageja");

  // グローバルに利用できるModel
  var app = module.exports = new Backbone.Model();

  // The root path to run the application through.
  app.root = "/";
});
