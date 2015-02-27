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
        "modernizr": "../bower_components/modernizr/modernizr",
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
        "jquery-steps": "../bower_components/jquery-steps/build/jquery.steps.min",
        "masonry": "../bower_components/masonry/dist/masonry.pkgd",
        "backbone-fetch-cache": "../bower_components/backbone-fetch-cache/backbone.fetch-cache",
        "rome" : "../bower_components/rome/dist/rome.standalone",
        "moment/locale/ja" : "../bower_components/moment/locale/ja",
        "canvas-to-blob" : "../bower_components/blueimp-canvas-to-blob/js/canvas-to-blob",
        "canvasResize": "../lib/canvasResize/canvasResize",
        "binaryajax": "../lib/canvasResize/binaryajax",
        "exif": "../lib/canvasResize/exif",
        "leaflet": "../bower_components/leaflet/dist/leaflet",
        "d3": "../bower_components/d3/d3.min",
        "leaflet.markercluster": "../bower_components/leaflet.markercluster/dist/leaflet.markercluster"
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
        "foundation" : [ "jquery", "modernizr" ],
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
        "jquery-steps" : [ "jquery" ],
        "backbone-fetch-cache" : [ "backbone" ],
        "rome" : [ "moment" ],
        "moment/locale/ja" : [ "moment" ],
        "canvasResize": ["binaryajax", "exif"]
    }
});
