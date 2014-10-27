require.config({
    paths : {
        "dc1-client" : "../lib/dao/dc1-client",
        "underscore" : "../bower_components/lodash/dist/lodash.underscore",
        "lodash" : "../bower_components/lodash/dist/lodash",
        "ldsh" : "../bower_components/lodash-template-loader/loader",
        "jquery" : "../bower_components/jquery/dist/jquery",
        "backbone" : "../bower_components/backbone/backbone",
        "layoutmanager" : "../bower_components/layoutmanager/backbone.layoutmanager",

        "jqueryvalidation" : "../bower_components/jquery-validation/dist/jquery.validate",
        "messageja" : "../lib/jqueryvalidation/messages_ja",
        "foundation" : "../bower_components/foundation/js/foundation",
        "nehan" : "../lib/nehan/nehan",
        "jquerynehan" : "../lib/nehan/jquery.nehan",
        "blockui" : "../lib/blockUI/jquery.blockUI"
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
        "blockui" : [ "jquery" ]
    }
});
