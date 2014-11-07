define(function(require, exports, module) {
    "use strict";
    var fnTest = /xyz/.test(function() {
        var xyz;
    }) ? /\b_super\b/ : /.*/;

    /**
     * 継承可能なクラス。
     * 参考：http://qiita.com/edo_m18/items/200ae66bd18011bda377
     */
    function Class() { /* noop. */
    }

    Class.extend = function(props) {

        var SuperClass = this;

        function Class() {
            if (typeof this.init === 'function') {
                this.init.apply(this, arguments);
            }
        }

        Class.prototype = Object.create(SuperClass.prototype, {
            constructor : {
                value : Class,
                writable : true,
                configurable : true
            }
        });

        Object.keys(props).forEach(function(key) {
            var prop = props[key], _super = SuperClass.prototype[key], isMethodOverride = (typeof prop === 'function' && typeof _super === 'function' && fnTest.test(prop));

            if (isMethodOverride) {
                Class.prototype[key] = function() {
                    var ret, tmp = this._super;

                    Object.defineProperty(this, '_super', {
                        value : _super,
                        configurable : true
                    });

                    ret = prop.apply(this, arguments);

                    Object.defineProperty(this, '_super', {
                        value : tmp,
                        configurable : true
                    });

                    return ret;
                };
            } else {
                Class.prototype[key] = prop;
            }
        });

        Class.extend = SuperClass.extend;

        return Class;
    };

    module.exports = Class;
});