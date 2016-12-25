import DataTable from './dataTable';
import { extend } from './util';

const COLORS = ['#a489d6', '#239afc', '#54d81c', '#5856ce', '#4386a0', '#093084', '#26aabf', '#5a25f9', '#76a0db', '#7588dd', '#f7eb91', '#daf783', '#d321e0', '#7634ef', '#05bc9b', '#cea146', '#ffbfc0', '#5dfc7d', '#ffc9f9', '#9ad5e0', '#8ea4e5', '#490c7f', '#49fcb4', '#20a33c', '#f7ee40', '#fcf63f', '#efef1f', '#f45642', '#e08374', '#30b6ff', '#f75f4f', '#27ddd7', '#af2f49', '#dbc4fc', '#53b220', '#a71dd1', '#15bfa2', '#f79f9e', '#c92427', '#380170', '#ed9f78', '#f464d5', '#dd6158', '#f7cfad', '#36e830', '#80f782', '#90f9ac', '#c69715', '#0a8ed6', '#9ec942', '#f9b1c8', '#a114ff', '#51dba4', '#a4abf2'];

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
    }
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
    }
}

function create({type, table, color, dataZoom, toolbox}) {
    let option = {
        legend: { // legend configuration
            //padding: 5, // The inner padding of the legend, in px, defaults to 5. Can be set as array - [top, right, bottom, left].
            //itemGap: 10, // The pixel gap between each item in the legend. It is horizontal in a legend with horizontal layout, and vertical in a legend with vertical layout.
            data: [],
            align: 'left'
        },
        tooltip: { // tooltip configuration
            trigger: 'item', // trigger type. Defaults to data trigger. Can also be: 'axis'
        },
        xAxis: [ // The horizontal axis in Cartesian coordinates
            {
                type: 'category', // Axis type. xAxis is category axis by default. As for value axis, please refer to the 'yAxis' chapter.
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
        yAxis: [ // The vertical axis in Cartesian coordinates
            {
                type: 'value', // Axis type. yAxis is value axis by default. As for category axis, please refer to the 'xAxis' chapter.
                //boundaryGap: [0.1, 0.1], // Blank border on each side of the coordinate axis. Value in the array represents percentage.
                //splitNumber: 4 // Applicable to value axis. The number of segments. Defaults to 5.
            }
        ],
        series: [],
        color,
        calculable: false,

    };
    const colCount = table.columnCount;
    if (colCount > 1) {
        for (let colIndex = 1; colIndex < colCount; colIndex++) {
            const colName = table.getColumn(colIndex).name;
            option.legend.data.push(colName);
            option.series.push({
                name: colName,
                type: type,
                data: []
            });
        }
        const rowCount = table.rowCount;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                if (j === 0) {
                    option.xAxis[0].data.push(table.getValue(i, j));
                } else {
                    option.series[j - 1].data.push(table.getValue(i, j));
                }
            }
        }
    }
    if (toolbox === true) {
        addToolbox(option)
    } else if (toolbox) {
        (<any>option).toolbox = toolbox
    }
    if (dataZoom === true) {
        addRoom(option)
    } else if (dataZoom) {
        (<any>option).dataZoom = dataZoom
    }
    return option;
}

const factory = {
    'line': function (obj) {
        return create(obj);
    },
    'bar': function (obj) {
        let option = create(obj)
        option.series.forEach(serie =>{
            extend(serie, {
                barMaxWidth: 30,
                label: {
                    normal: {
                        show: true,
                        position: 'outside'
                    }
                }
            })
        })
        return option;
    },
    'pie': function (obj) {
        var option = <any>create(obj)
        option.tooltip.formatter = '{a} <br/>{b} : {c} ({d}%)'
        let serie = option.series[0];
        if(serie){
            extend(serie, {
                radius: '55%',
                center: ['50%', '50%'],
                data: []
            })
        }
        return option;
    }
};

export default function createChartOption({type, data, color = COLORS, dataZoom, toolbox}) {
    let fn = factory[type];
    if (fn) {
        let table = data instanceof DataTable ? data : new DataTable(data);
        return fn({ type, table, color, dataZoom, toolbox });
    } else {
        throw new Error('unsupported chart type in simple mode, please use option directly')
    }
}
