(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './chartFactory', 'echarts/dist/echarts', 'riot'], factory);
    }
})(function (require, exports) {
    "use strict";
    var chartFactory_1 = require('./chartFactory');
    var echarts = require('echarts/dist/echarts');
    var riot = require('riot');
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
            var context = scope || this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }
    riot.tag('echart', '<div class="chart" name="chartDiv" ></div>', function (opts) {
        var _this = this;
        var scope = this;
        var chart = null;
        scope.on('mount', function () {
            if (typeof opts.fetch === 'function') {
                opts.fetch(function (data, err) {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        scope.drawChart(data);
                    }
                });
            }
            esle;
            {
                _this.update();
            }
        });
        scope.on('unmount', function () {
            scope.destroyChart();
        });
        scope.on('updated', function () {
            if (opts.data) {
                scope.drawChart(opts.data);
            }
        });
        scope.drawChart = debounce(function (data) {
            if (!scope.isMounted) {
                return;
            }
            if (!chart) {
                chart = echarts.init(scope.chartDiv);
            }
            var chartType = opts.chart_type || 'pie';
            var option = chartFactory_1.default(chartType, data);
            if (option && chart) {
                chart.setOption(option);
            }
        }, DRAW_DELAY);
        scope.redrawChart = function () {
            scope.destroyChart();
            scope.update();
        };
        scope.destroyChart = function () {
            if (chart) {
                chart.despose();
                chart = null;
            }
        };
    });
});
