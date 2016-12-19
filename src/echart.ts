import factory from './chartFactory';
import * as echarts from 'echarts'
import DataTable from './dataTable';
import * as riot from 'riot';

interface IEchartTag extends RiotTag {
    isMounted: boolean;
    drawChart(data?: any);
    redrawChart();
    destroyChart();
    chartHost: HTMLElement;
}

interface IEchartTagOpts {
    /**
     * fetch data
     */
    fetch?: (cb: (err, data) => any) => any;
    /**
     * the chart type to be rendered
     */
    chart_type: string;
    /**
     * provide data directly; otherwise be provided by fetch function
     */
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
    return function(...args) {
        let context = scope || this;
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    };
}

riot.tag('echart', '<div class="chart" ref="chartHost" ></div>',
    'echart, echart .chart,[data-is="echart"], [data-is="echart"] .chart {display:block; width:100%; height: 100%;}', 
    function(opts: IEchartTagOpts) {
    let self = <IEchartTag>this;
    let chart = null;

    Object.defineProperty(self, 'chartHost', {
        configurable: false,
        enumerable: false,
        get(){
            return self.refs['chartHost']
        }
    });

    self.on('mount', () => {
        if (typeof opts.fetch === 'function') {
            opts.fetch((data, err) => {
                if (err) {
                    console.error(err);
                } else {
                    self.drawChart(data);
                }
            });
        } else{
            self.update();
        }
    });

    self.on('unmount', () => {
        self.destroyChart();
    });

    self.on('updated', () => {
        if (opts.data) {
            self.drawChart(opts.data);
        }
    });

    self.drawChart = debounce((data) => {
        if (!self.isMounted || !self.chartHost) {
            return;
        }
        if (!chart) {
            chart = echarts.init(self.chartHost);
        }
        const chartType = opts.chart_type || 'pie';
        const option = factory(chartType, data);
        if (option && chart) {
            chart.setOption(option);
        }
    }, DRAW_DELAY);

    self.redrawChart = () => {
        self.destroyChart();
        self.update();
    };

    self.destroyChart = () => {
        if (chart) {
            chart.despose();
            chart = null;
        }
    };
});
