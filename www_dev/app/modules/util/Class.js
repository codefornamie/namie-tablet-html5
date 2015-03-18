/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(function(require, exports, module) {
    "use strict";
    var fnTest = /xyz/.test(function() {
        var xyz;
    }) ? /\b_super\b/ : /.*/;

    /**
     * 継承可能なクラス。
     * 参考：http://qiita.com/edo_m18/items/200ae66bd18011bda377
     * @class 継承可能なクラス。
     * @constructor
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