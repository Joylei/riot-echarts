(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    /**
    * Wrap data array for convinient operations.
    * the first line of the array is columns,
    * and the rest lines are data rows
    */
    var DataTable = (function () {
        /**
        * @param {Object[][]} data the first line of the array is columns,and the rest lines are data rows
        */
        function DataTable(data) {
            data = data || [];
            this.columns = [];
            var columns = data[0] || [];
            for (var i = 0, len = columns.length; i < len; i++) {
                this.columns.push({
                    field: columns[i]
                });
            }
            this.rows = data.slice(1);
        }
        DataTable.prototype.getColumn = function (col) {
            return this.columns[col];
        };
        DataTable.prototype.getColumnCount = function () {
            return this.columns.length;
        };
        DataTable.prototype.getRowCount = function () {
            return this.rows.length;
        };
        DataTable.prototype.getRow = function (row) {
            return this.rows[row];
        };
        DataTable.prototype.getValue = function (row, col) {
            if (row < 0 || col < 0)
                return null;
            var item = this.rows[row];
            if (item) {
                return item[col];
            }
            return null;
        };
        DataTable.prototype.setValue = function (row, col, val) {
            if (row < 0 || col < 0)
                return;
            var item = this.rows[row];
            if (!item) {
                item = this.rows[row] = [];
            }
            item[col] = val;
        };
        /**
        * convert data rows to objects
        * @return {Object[]}
        */
        DataTable.prototype.toJSON = function () {
            var data = [];
            if (this.rows.length > 0) {
                for (var i = 0, len = this.rows.length; i < len; i++) {
                    var row = {};
                    for (var j = 0, jlen = this.columns.length; j < jlen; j++) {
                        row[this.columns[j].field] = this.rows[i][j];
                    }
                    data.push(row);
                }
            }
            return data;
        };
        return DataTable;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DataTable;
});
