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
    columns.forEach(function (item) { return this$1.columns.push({ name: item }); });
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
        this$1.columns.forEach(function (col, index) { return item[col.name] = row[index]; });
        return item;
    });
};

Object.defineProperties( DataTable.prototype, prototypeAccessors );

function extend(dest, src) {
    if ( src === void 0 ) src = {};

    var obj = dest || {};
    Object.keys(src).forEach(function (key) {
        obj[key] = src[key];
    });
    return obj;
}
function isFunction(obj) {
    return typeof obj === 'function';
}

var COLORS = ['#a489d6', '#239afc', '#54d81c', '#5856ce', '#4386a0', '#093084', '#26aabf', '#5a25f9', '#76a0db', '#7588dd', '#f7eb91', '#daf783', '#d321e0', '#7634ef', '#05bc9b', '#cea146', '#ffbfc0', '#5dfc7d', '#ffc9f9', '#9ad5e0', '#8ea4e5', '#490c7f', '#49fcb4', '#20a33c', '#f7ee40', '#fcf63f', '#efef1f', '#f45642', '#e08374', '#30b6ff', '#f75f4f', '#27ddd7', '#af2f49', '#dbc4fc', '#53b220', '#a71dd1', '#15bfa2', '#f79f9e', '#c92427', '#380170', '#ed9f78', '#f464d5', '#dd6158', '#f7cfad', '#36e830', '#80f782', '#90f9ac', '#c69715', '#0a8ed6', '#9ec942', '#f9b1c8', '#a114ff', '#51dba4', '#a4abf2'];
function addToolbox(option) {
    option.toolbox = {
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
    };
}
function addRoom(option) {
    option.dataZoom = {
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
    };
}
function create(ref) {
    var type = ref.type;
    var table = ref.table;
    var color = ref.color;
    var dataZoom = ref.dataZoom;
    var toolbox = ref.toolbox;

    var option = {
        legend: {
            //padding: 5, // The inner padding of the legend, in px, defaults to 5. Can be set as array - [top, right, bottom, left].
            //itemGap: 10, // The pixel gap between each item in the legend. It is horizontal in a legend with horizontal layout, and vertical in a legend with vertical layout.
            data: [],
            align: 'left'
        },
        tooltip: {
            trigger: 'item',
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
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
            }
        ],
        series: [],
        color: color,
        calculable: false,
    };
    var colCount = table.columnCount;
    if (colCount > 1) {
        for (var colIndex = 1; colIndex < colCount; colIndex++) {
            var colName = table.getColumn(colIndex).name;
            option.legend.data.push(colName);
            option.series.push({
                name: colName,
                type: type,
                data: []
            });
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
    if (toolbox === true) {
        addToolbox(option);
    }
    else if (toolbox) {
        option.toolbox = toolbox;
    }
    if (dataZoom === true) {
        addRoom(option);
    }
    else if (dataZoom) {
        option.dataZoom = dataZoom;
    }
    return option;
}
var factory = {
    'line': function (obj) {
        return create(obj);
    },
    'bar': function (obj) {
        var option = create(obj);
        option.series.forEach(function (serie) {
            extend(serie, {
                barMaxWidth: 30,
                label: {
                    normal: {
                        show: true,
                        position: 'outside'
                    }
                }
            });
        });
        return option;
    },
    'pie': function (obj) {
        var option = create(obj);
        option.tooltip.formatter = '{a} <br/>{b} : {c} ({d}%)';
        var serie = option.series[0];
        if (serie) {
            extend(serie, {
                radius: '55%',
                center: ['50%', '50%'],
                data: []
            });
        }
        return option;
    }
};
function createChartOption(ref) {
    var type = ref.type;
    var data = ref.data;
    var color = ref.color; if ( color === void 0 ) color = COLORS;
    var dataZoom = ref.dataZoom;
    var toolbox = ref.toolbox;

    var fn = factory[type];
    if (fn) {
        var table = data instanceof DataTable ? data : new DataTable(data);
        return fn({ type: type, table: table, color: color, dataZoom: dataZoom, toolbox: toolbox });
    }
    else {
        throw new Error('unsupported chart type in simple mode, please use option directly');
    }
}

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
    Object.defineProperty(self, 'chart', {
        get: function get() {
            return chart;
        }
    });
    function getHost() {
        //compatible with riot@2.x.x
        return self.refs['chartHost'] || self.root.querySelector('[.chart]');
    }
    var _chartHost;
    var _option = {};
    self.on('mount', function () {
        if (!echarts || !isFunction(echarts.init)) {
            throw new Error('please import ECharts!!!');
        }
        _chartHost = getHost();
        self.drawChart();
    });
    self.on('unmount', function () {
        self.destroyChart();
    });
    self.on('updated', function () {
        self.drawChart();
    });
    self.drawChart = debounce(function () {
        if (!self.isMounted || !_chartHost) {
            return;
        }
        if (!chart) {
            chart = echarts.init(_chartHost);
        }
        if (opts.option) {
            chart.setOption(opts.option);
            return;
        }
        if (opts.simple) {
            var chartType = opts.simple.type || 'pie';
            chart.showLoading();
            var cb = function (err, data) {
                if (err) {
                    console.error(err);
                    return;
                }
                if (data && isFunction(data.then)) {
                    data.then(function (d) { return cb(null, d); }, cb);
                    return;
                }
                var chartObj = extend({}, opts.simple);
                chartObj.data = data;
                var option = createChartOption(chartObj);
                if (option && chart) {
                    chart.setOption(option);
                }
                chart.hideLoading();
            };
            var data;
            if (isFunction(opts.simple.data)) {
                var result = opts.simple.data.call(null, cb);
                if (!result) {
                    return;
                }
                data = result;
            }
            data = data || opts.simple.data;
            if (data) {
                cb(null, data);
            }
            else {
                chart.hideLoading();
            }
        }
    }, DRAW_DELAY);
    self.redrawChart = function () {
        self.destroyChart();
        self.update();
    };
    self.destroyChart = function () {
        if (chart) {
            chart.dispose();
            chart = null;
        }
    };
});
//hook window resize event
window.addEventListener('resize', debounce(function (e) {
    var charts = [].slice.call(document.querySelectorAll('echart, [data-is="echart"]'));
    charts.forEach(function (el) {
        var tag$$1 = el._tag;
        if (tag$$1 && tag$$1.chart) {
            tag$$1.chart.resize();
        }
    });
}, 300));

var index = {
    DataTable: DataTable,
    factory: createChartOption
};

return index;

})));
//# sourceMappingURL=riot-echarts.js.map
