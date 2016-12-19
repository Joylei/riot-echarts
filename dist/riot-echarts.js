(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('echarts'), require('riot')) :
   typeof define === 'function' && define.amd ? define('riot-echarts', ['echarts', 'riot'], factory) :
   (global.riotECharts = factory(global.echarts,global.riot));
}(this, (function (echarts,riot) { 'use strict';

/**
* Wrap data array for convinient operations.
* the first line of the array is columns,
* and the rest lines are data rows
*/
var DataTable = function DataTable(data) {
    var this$1 = this;

    data = data || [];
    this.columns = [];
    var columns = data[0] || [];
    columns.forEach(function (item) { return this$1.columns.push({ field: item }); });
    this.rows = data.slice(1);
};

var prototypeAccessors = { columnCount: {},rowCount: {} };
DataTable.prototype.getColumn = function getColumn (col) {
    return this.columns[col];
};
prototypeAccessors.columnCount.get = function () {
    return this.columns.length;
};
prototypeAccessors.rowCount.get = function () {
    return this.rows.length;
};
DataTable.prototype.getRow = function getRow (row) {
    return this.rows[row];
};
DataTable.prototype.getValue = function getValue (row, col) {
    if (row < 0 || col < 0)
        { return null; }
    var item = this.rows[row];
    return item ? item[col] : null;
};
DataTable.prototype.setValue = function setValue (row, col, val) {
    if (row < 0 || col < 0)
        { return; }
    var item = this.rows[row] || (this.rows[row] = []);
    item[col] = val;
};
/**
* convert data rows to objects
* @return {Object[]}
*/
DataTable.prototype.toJSON = function toJSON () {
        var this$1 = this;

    return this.rows.map(function (row) {
        var item = {};
        this$1.columns.forEach(function (col, index) { return item[col.field] = row[index]; });
        return item;
    });
};

Object.defineProperties( DataTable.prototype, prototypeAccessors );


var DataTable$2 = Object.freeze({
	default: DataTable
});

function extend(dest, src) {
    if ( src === void 0 ) src = {};

    var obj = dest || {};
    Object.keys(src).forEach(function (key) {
        obj[key] = src[key];
    });
    return obj;
}

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
    var colCount = table.columnCount;
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
        var rowCount = table.rowCount;
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
        for (var rowIndex = 0, rowCount = table.rowCount; rowIndex < rowCount; rowIndex++) {
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
        var table = data instanceof DataTable ? data : new DataTable(data);
        return fn(table);
    }
}


var factory$1 = Object.freeze({
	default: createChartOption
});

var DRAW_DELAY = 500;
/**
   * delay function call until there is no more invocation;
   * taken from https://remysharp.com/2010/07/21/throttling-function-calls
   * @param  {Function} fn    [description]
   * @param  {number}   delay [description]
   * @param  {any}      scope [description]
   * @return {Function}       [description]
   */
function debounce(fn, delay, scope) {
    var timer = null;
    return function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var context = scope || this;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}
riot.tag('echart', '<div class="chart" ref="chartHost" ></div>', 'echart, echart .chart,[data-is="echart"], [data-is="echart"] .chart {display:block; width:100%; height: 100%;}', function (opts) {
    var self = this;
    var chart = null;
    Object.defineProperty(self, 'chartHost', {
        configurable: false,
        enumerable: false,
        get: function get() {
            return self.refs['chartHost'];
        }
    });
    self.on('mount', function () {
        if (typeof opts.fetch === 'function') {
            opts.fetch(function (data, err) {
                if (err) {
                    console.error(err);
                }
                else {
                    self.drawChart(data);
                }
            });
        }
        else {
            self.update();
        }
    });
    self.on('unmount', function () {
        self.destroyChart();
    });
    self.on('updated', function () {
        if (opts.data) {
            self.drawChart(opts.data);
        }
    });
    self.drawChart = debounce(function (data) {
        if (!self.isMounted || !self.chartHost) {
            return;
        }
        if (!chart) {
            chart = echarts.init(self.chartHost);
        }
        var chartType = opts.chart_type || 'pie';
        var option = createChartOption(chartType, data);
        if (option && chart) {
            chart.setOption(option);
        }
    }, DRAW_DELAY);
    self.redrawChart = function () {
        self.destroyChart();
        self.update();
    };
    self.destroyChart = function () {
        if (chart) {
            chart.despose();
            chart = null;
        }
    };
});

var index = {
    DataTable: DataTable$2,
    factory: factory$1
};

return index;

})));
//# sourceMappingURL=riot-echarts.js.map
