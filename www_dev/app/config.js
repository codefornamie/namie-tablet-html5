require.config({
    paths : {
        "dc1-client" : "../lib/dao/dc1-client",
        "underscore" : "../bower_components/lodash/dist/lodash.underscore",
        "lodash" : "../bower_components/lodash/dist/lodash",
        "ldsh" : "../lib/lodash-template-loader/loader",
        "jquery" : "../bower_components/jquery/dist/jquery",
        "backbone" : "../bower_components/backbone/backbone",
        "layoutmanager" : "../bower_components/layoutmanager/backbone.layoutmanager",

        "jqueryvalidation" : "../bower_components/jquery-validation/dist/jquery.validate",
        "messageja" : "../lib/jqueryvalidation/messages_ja",
        "foundation" : "../bower_components/foundation/js/foundation",
        "nehan" : "../lib/nehan/nehan",
        "jquerynehan" : "../lib/nehan/jquery.nehan",
        "blockui" : "../lib/blockUI/jquery.blockUI",
        "panzoom" : "../bower_components/jquery.panzoom/dist/jquery.panzoom",
        "snap" : "../bower_components/Snap.js/snap.min",
        "async": "../bower_components/async/lib/async",
        "vex" : "../bower_components/vex/js/vex",
        "vexDialog" : "../bower_components/vex/js/vex.dialog",
        "jsSha" : "../bower_components/jsSHA/src/sha256",
        "datejs": "../lib/foundation-calendar/js/date",
        "foundation-calendar": "../lib/foundation-calendar/foundation_calendar",
        "date-helpers": "../lib/foundation-calendar/helpers/date-helpers",
        "string-helpers": "../lib/foundation-calendar/helpers/string-helpers",
        "jquery-sortable": "../bower_components/html5sortable/jquery.sortable",
        "galocalstorage" : "../bower_components/GALocalStorage/GALocalStorage",
        "moment" : "../bower_components/moment/min/moment.min",
        "log4javascript": "../lib/log4javascript/log4javascript_uncompressed",
        "colorbox" : "../bower_components/jquery-colorbox/jquery.colorbox",
    },

    deps : [ "main" ],
    shim : {
        "backbone" : {
            deps : [ "jquery", "underscore" ],
            exports : "Backbone"
        },
        "jqueryvalidation" : [ "jquery" ],
        "messageja": {
            deps : [ "jqueryvalidation" ]
        },
        "foundation" : [ "jquery" ],
        "nehan" : {
            deps : [ "jquery" ],
            exports : "Nehan"
        },
        "jquerynehan" : [ "nehan" ],
        "blockui" : [ "jquery" ],
        "panzoom" : [ "jquery" ],
        "vex" : [ "jquery" ],
        "vexDialog" : [ "vex" ],
        "date-helpers": [ "datejs"],
        "foundation-calendar": ["date-helpers", "string-helpers", "foundation"],
        "jquery-sortable" : [ "jquery" ],
        "colorbox" : [ "jquery" ],
    }
});
