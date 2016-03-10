(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './dataTable', './chartFactory', './echart-tag'], factory);
    }
})(function (require, exports) {
    "use strict";
    var DataTable = require('./dataTable');
    var factory = require('./chartFactory');
    require('./echart-tag');
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        DataTable: DataTable,
        factory: factory
    };
});
