require.config({
    paths : {
        "dc1-client" : "../lib/dao/dc1-client",
        "underscore" : "../bower_components/lodash/dist/lodash.underscore",
        "lodash" : "../bower_components/lodash/dist/lodash",
        "ldsh" : "../bower_components/lodash-template-loader/loader",
        "jquery" : "../bower_components/jquery/dist/jquery",
        "backbone" : "../bower_components/backbone/backbone",
        "layoutmanager" : "../bower_components/layoutmanager/backbone.layoutmanager",

        "foundation" : "../bower_components/foundation/js/foundation"
    },

    deps : [ "main" ],
    shim : {
        "backbone" : {
            deps : [ "jquery", "underscore" ],
            exports : "Backbone"
        },

        "foundation" : [ "jquery" ]
    }
});
