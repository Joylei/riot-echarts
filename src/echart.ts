import factory from './chartFactory';
import * as echarts from 'echarts'
import DataTable from './dataTable';
import * as riot from 'riot';
import {isFunction, extend} from './util'

interface IEchartTag extends RiotTag {
    isMounted: boolean;
    chart: any;
    drawChart();
    redrawChart();
    destroyChart();
}

type Callback = (err, data) => any;
type DataFunc = () => (DataTable | any[] | Thenable)
type LazyDataFunc = (cb:Callback)=>any
type Thenable = { then:(success: (data) => any, error: (err)=>any)=>any }
interface IEchartTagOpts {
    /**
     * ECharts option
     */
    option?: any,
    simple?: {
        /**
         * chart type
         */
        type?: string,
        /**
         * color sheets;
         */
        color?: Array<string>,

        /**
         * ECharts toolbox options
         */
        toolbox?: boolean | Object,

        /**
         * ECharts dataZoom options
         */
        dataZoom?: boolean | Object, 
        /**
         * provide data directly; otherwise be provided by function;
         * the data can be:
         * - DataTable
         * - any[][]
         * - a function returns DataTable or any[][]
         * - a function returns thenable object
         * - a thenable object
         * - a function accept a callback to handle data 
         */
        data?: DataTable | any[] | Thenable | DataFunc | LazyDataFunc;
    }
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
    
    Object.defineProperty(self, 'chart', {
        get(){
            return chart
        }
    })

    function getHost(){
        //compatible with riot@2.x.x
        return self.refs['chartHost'] || self.root.querySelector('[.chart]')
    }

    let _chartHost:HTMLElement
    let _option = {}
    self.on('mount', () => {
        if(!echarts || !isFunction(echarts.init)){
            throw new Error('please import ECharts!!!')
        }

        _chartHost = <HTMLElement>getHost();
        self.drawChart()
    });

    self.on('unmount', () => {
        self.destroyChart();
    });

    self.on('updated', ()=>{
        self.drawChart()
    })

    self.drawChart = debounce(() => {
        if (!self.isMounted || !_chartHost) {
            return;
        }
        if (!chart) {
            chart = echarts.init(_chartHost);
        }
        if(opts.option){
            chart.setOption(opts.option);
            return
        }
        if(opts.simple){
            const chartType = opts.simple.type || 'pie';
            chart.showLoading()
            const cb = (err, data)=>{
                if(err){
                    console.error(err);
                    return
                }
                if(data && isFunction(data.then)) {
                    data.then(d => cb(null,d), cb)
                    return
                }
                let chartObj = extend({},opts.simple)
                chartObj.data = data
                const option = factory(chartObj);
                if (option && chart) {
                    chart.setOption(option);
                }
                chart.hideLoading()
            };
            let data;
            if(isFunction(opts.simple.data)){
                let result = (<any>opts.simple.data).call(null, cb)
                if(!result) {
                    return
                }
                data = result
            }
            data = data || opts.simple.data
            if(data){
                cb(null, data)
            }else{
                chart.hideLoading()
            }
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

//hook window resize event
window.addEventListener('resize', debounce(function(e){
    let charts = [].slice.call(document.querySelectorAll('echart, [data-is="echart"]'))
    charts.forEach(el =>{
        let tag = <IEchartTag>el._tag
        if(tag && tag.chart){
            tag.chart.resize()
        }
    })
}, 300))