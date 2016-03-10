(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './dataTable', 'extend'], factory);
    }
})(function (require, exports) {
    "use strict";
    var dataTable_1 = require('./dataTable');
    var extend = require('extend');
    var COLORS = ['#a489d6', '#239afc', '#54d81c', '#5856ce', '#4386a0', '#093084', '#26aabf', '#5a25f9', '#76a0db', '#7588dd', '#f7eb91', '#daf783', '#d321e0', '#7634ef', '#05bc9b', '#cea146', '#ffbfc0', '#5dfc7d', '#ffc9f9', '#9ad5e0', '#8ea4e5', '#490c7f', '#49fcb4', '#20a33c', '#f7ee40', '#fcf63f', '#efef1f', '#f45642', '#e08374', '#30b6ff', '#f75f4f', '#27ddd7', '#af2f49', '#dbc4fc', '#53b220', '#a71dd1', '#15bfa2', '#f79f9e', '#c92427', '#380170', '#ed9f78', '#f464d5', '#dd6158', '#f7cfad', '#36e830', '#80f782', '#90f9ac', '#c69715', '#0a8ed6', '#9ec942', '#f9b1c8', '#a114ff', '#51dba4', '#a4abf2'];
    function create(chartType, table, extra) {
        var option = {
            legend: {
                padding: 5,
                itemGap: 10,
                data: []
            },
            tooltip: {
                trigger: 'item',
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        type: ['line', 'bar', 'stack'],
                        title: {
                            'line': 'Line Chart',
                            'bar': 'Column Chart',
                            'stack': 'Stacked Bar Chart'
                        }
                    },
                    restore: {
                        title: 'Restore'
                    },
                    saveAsImage: {
                        title: 'Save AS Image'
                    },
                }
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisLabel: {
                        show: true,
                        interval: 'auto',
                        textStyle: {
                            fontStyle: 'italic'
                        }
                    },
                    data: []
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    boundaryGap: [0.1, 0.1],
                }
            ],
            series: [],
            color: COLORS,
            calculable: false,
            dataZoom: {
                show: true,
                realtime: true,
                //dataBackgroundColor: "#80D9C3",
                handleColor: '#018564',
                fillerColor: '#80D9C3',
                handleSize: 3,
                //y : 'bottom',
                height: 20,
                start: 50,
                end: 100
            }
        };
        var colCount = table.getColumnCount();
        if (colCount > 1) {
            for (var colIndex = 1; colIndex < colCount; colIndex++) {
                var colName = table.getColumn(colIndex).field;
                option.legend.data.push(colName);
                var item = extend({
                    name: colName,
                    type: chartType,
                    data: []
                }, extra);
                option.series.push(item);
            }
            var rowCount = table.getRowCount();
            for (var i = 0; i < rowCount; i++) {
                for (var j = 0; j < colCount; j++) {
                    if (j === 0) {
                        option.xAxis[0].data.push(table.getValue(i, j));
                    }
                    else {
                        option.series[j - 1].data.push(table.getValue(i, j));
                    }
                }
            }
        }
        return option;
    }
    var factory = {
        'line': function (table) {
            return create('line', table);
        },
        'bar': function (table) {
            return create('bar', table, {
                barMaxWidth: 25,
                label: {
                    normal: {
                        show: true,
                        position: 'outside'
                    }
                }
            });
        },
        'pie': function (table) {
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [],
                color: COLORS
            };
            var serie = {
                name: 'Data',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: []
            };
            serie.name = (table.getColumn(0) || {}).field || 'Data';
            for (var rowIndex = 0, rowCount = table.getRowCount(); rowIndex < rowCount; rowIndex++) {
                var item = {
                    name: table.getValue(rowIndex, 0) || ('Untitled' + rowIndex),
                    value: table.getValue(rowIndex, 1) || 0
                };
                serie.data.push(item);
            }
            option.series.push(serie);
            return option;
        }
    };
    function createChartOption(chartType, data) {
        var fn = factory[chartType];
        if (fn) {
            var table = data instanceof dataTable_1.default ? data : new dataTable_1.default(data);
            return fn(table);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createChartOption;
});
