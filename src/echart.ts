import factory from './chartFactory';
import * as echarts from 'echarts/dist/echarts'
import DataTable from './dataTable';
import * as riot from 'riot';

interface IEchartTag {
    isMounted: boolean;
    on(events: string, fn?: Function);
    off(events: string, fn?: Function);
    update();
    drawChart(data?: any);
    redrawChart();
    destroyChart();
    chartDiv: HTMLElement;
}

interface IEchartTagOpts {
    fetch?: (cb: (err, data) => any) => any;
    chart_type: string;
    data?: DataTable | any[];
}

const DRAW_DELAY = 500;
/**
   * delay function call until there is no more invocation;
   * taken from https://remysharp.com/2010/07/21/throttling-function-calls
   * @param  {Function} fn    [description]
   * @param  {number}   delay [description]
   * @param  {any}      scope [description]
   * @return {Function}       [description]
   */
function debounce(fn: Function, delay: number, scope?: any) {
    let timer = null;
    return function() {
        let context = scope || this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    };
}

riot.tag('echart', '<div class="chart" name="chartDiv" ></div>', function(opts: IEchartTagOpts) {
    let scope = <IEchartTag>this;
    let chart = null;

    scope.on('mount', () => {
        if (typeof opts.fetch === 'function') {
            opts.fetch((data, err) => {
                if (err) {
                    console.error(err);
                } else {
                    scope.drawChart(data);
                }
            });
        } esle{
            this.update();
        }
    });

    scope.on('unmount', () => {
        scope.destroyChart();
    });

    scope.on('updated', () => {
        if (opts.data) {
            scope.drawChart(opts.data);
        }
    });

    scope.drawChart = debounce((data) => {
        if (!scope.isMounted) {
            return;
        }
        if (!chart) {
            chart = echarts.init(scope.chartDiv);
        }
        let chartType = opts.chart_type || 'pie';
        let option = factory(chartType, data);
        if (option && chart) {
            chart.setOption(option);
        }
    }, DRAW_DELAY);

    scope.redrawChart = () => {
        scope.destroyChart();
        scope.update();
    };

    scope.destroyChart = () => {
        if (chart) {
            chart.despose();
            chart = null;
        }
    };
});
