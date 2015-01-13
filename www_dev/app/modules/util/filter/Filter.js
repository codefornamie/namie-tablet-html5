define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var Class = require("modules/util/Class");
    var Log = require("modules/util/Logger");

    /**
     * PCS ODataの$filterのクエリ作成処理を行うためのユーティリティクラスを作成する。
     * <p>
     * このクラスは、$filterに指定可能な演算子(eq, ge, leなど)を利用して、$filterに指定可能な
     * クエリ文字列を生成するための共通機能を提供する。<br>
     * 各演算子の処理は、本クラスを派生させて作成する。<br>
     * 現状、以下の演算子を表現するためのクラスが用意されている。<br>
     * <ul>
     * <li>Equal<br>
     * eq演算子を利用する式を生成する</li>
     * <li>Ge<br>
     * ge,gt演算子を利用する式を生成する</li>
     * <li>Le<br>
     * le,lt演算子を利用する式を生成する</li>
     * </ul>
     * </p>
     * <p>
     * 利用例：<br>
     * <code>
     * var filters = [new Equal("country", "Japan"), new Equal("address", "Kanagawa")];
     * var filterQueryString = Filter.queryString(filters);
     * </code>
     * 以下のクエリを生成する。<br>
     * <code>
     * country eq 'Japan' and address eq 'Kanagawa'
     * </code>
     * </p>
     *
     * @class $filterのクエリ作成処理を行うためのユーティリティクラス
     * @exports Filter
     * @constructor
     */
    var Filter = Class.extend({
        /**
         * 初期化
         * @memberOf Filter#
         */
        init : function() {

        }
    });

    /**
     * 指定された演算子の配列をもとに、$filterに指定可能なクエリ文字列を生成する。
     *
     * @param {Array}
     *            filters 演算子(Equal, Ge, Le などのインスタンス)の配列
     * @returns {String} クエリ文字列
     * @memberOf Filter#
     */
    Filter.queryString = function(filters) {
        if (!_.isArray(filters)) {
            filters = [filters];
        }
        var queryValue = "";
        _.each(filters, function(filter) {
            var query = Filter.makeQueryString(filter);
            if (queryValue) {
                queryValue += " and ";
            }
            queryValue += query;
        });
        return queryValue;
    };
    /**
     * 検索条件を生成する。
     * <p>
     * 指定された検索条件をもとに、PCSに指定可能な検索条件が設定されたObjectを生成する。<br>
     * conditionパラメタには、以下のプロパティを指定する。
     * <ul>
     * <li>top<br>
     * $topに指定される数値。省略した場合、本メソッド内の処理でデフォルト値として50が設定される。</li>
     * <li>filters<br>
     * $filterクエリを生成するための演算子クラスのインスタンスの配列。<br>
     * 本メソッドの処理で指定した演算子をもとにクエリが生成され、filterプロパティにクエリ文字列が設定される。</li>
     * </ul>
     * </p>
     *
     * @param {Object}
     *            condition 検索条件
     * @returns 変換された検索条件
     * @memberOf Filter#
     */
    Filter.searchCondition = function(condition) {
        if (!condition.top) {
            condition.top = 50;
        }
        if (condition.filters) {
            condition.filter = Filter.queryString(condition.filters);
        }
        return condition;
    };
    /**
     * 指定された演算子（または、演算子の配列）をもとに、クエリ文字列を生成する。
     * <p>
     * このメソッドはFilter#queryStringメソッド内の処理で呼び出されることを意図して作成されており、
     * 外部のクラスはこのメソッドを直接呼び出すことはできない。
     * </p>
     *
     * @param {Filter}
     *            filter 演算子クラスのインスタンス。または、演算子クラスのインスタンスの配列
     * @returns 生成したクエリ
     * @memberOf Filter#
     */
    Filter.makeQueryString = function(filter) {
        if (filter.expression) {
            return filter.expression();
        } else if (_.isArray(filter)) {
            var query = "";
            _.each(filter, function(targetFilter) {
                if (query) {
                    query += " and ";
                }
                query += Filter.makeQueryString(targetFilter);
            });
            return "( " + query + " )";
        }
    };
    /**
     * 指定された文字列内のシングルクォートをエスケープする。
     * @param value 文字列
     * @returns シングルクォートがエスケープされた文字列
     * @memberOf Filter#
     */
    Filter.prototype.escapeSingleQuote = function(value) {
        var res = value.replace("'", "''");
        return res;
    };
    /**
     * この演算子が表現する式を生成する。
     * <p>
     * サブクラスは、このメソッドをオーバライドし、本クラスが表現する式を返却する処理を実装する必要がある。
     * </p>
     *
     * @returns {String} 式
     * @memberOf Filter#
     */
    Filter.prototype.expression = function() {
        return "";
    };
    module.exports = Filter;
});
