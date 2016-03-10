import DataTable from './dataTable';
import *as extend from 'extend';

const COLORS = ['#a489d6', '#239afc', '#54d81c', '#5856ce', '#4386a0', '#093084', '#26aabf', '#5a25f9', '#76a0db', '#7588dd', '#f7eb91', '#daf783', '#d321e0', '#7634ef', '#05bc9b', '#cea146', '#ffbfc0', '#5dfc7d', '#ffc9f9', '#9ad5e0', '#8ea4e5', '#490c7f', '#49fcb4', '#20a33c', '#f7ee40', '#fcf63f', '#efef1f', '#f45642', '#e08374', '#30b6ff', '#f75f4f', '#27ddd7', '#af2f49', '#dbc4fc', '#53b220', '#a71dd1', '#15bfa2', '#f79f9e', '#c92427', '#380170', '#ed9f78', '#f464d5', '#dd6158', '#f7cfad', '#36e830', '#80f782', '#90f9ac', '#c69715', '#0a8ed6', '#9ec942', '#f9b1c8', '#a114ff', '#51dba4', '#a4abf2'];

function create(chartType, table, extra) {
    let option = {
        legend: { // legend configuration
            padding: 5, // The inner padding of the legend, in px, defaults to 5. Can be set as array - [top, right, bottom, left].
            itemGap: 10, // The pixel gap between each item in the legend. It is horizontal in a legend with horizontal layout, and vertical in a legend with vertical layout.
            data: []
        },
        tooltip: { // tooltip configuration
            trigger: 'item', // trigger type. Defaults to data trigger. Can also be: 'axis'
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
        xAxis: [ // The horizontal axis in Cartesian coordinates
            {
                type: 'category', // Axis type. xAxis is category axis by default. As for value axis, please refer to the 'yAxis' chapter.
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
        yAxis: [ // The vertical axis in Cartesian coordinates
            {
                type: 'value', // Axis type. yAxis is value axis by default. As for category axis, please refer to the 'xAxis' chapter.
                boundaryGap: [0.1, 0.1], // Blank border on each side of the coordinate axis. Value in the array represents percentage.
                //splitNumber: 4 // Applicable to value axis. The number of segments. Defaults to 5.
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
    let colCount = table.getColumnCount();
    if (colCount > 1) {
        for (let colIndex = 1; colIndex < colCount; colIndex++) {
            let colName = table.getColumn(colIndex).field;
            option.legend.data.push(colName);
            let item = extend({
                name: colName,
                type: chartType,
                data: []
            }, extra);
            option.series.push(item);
        }
        let rowCount = table.getRowCount();
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
    return option;
}

const factory = {
    'line': function(table) {
        return create('line', table);
    },
    'bar': function(table) {
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
    'pie': function(table) {
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            series: [],
            color: COLORS
        };
        let serie = {
            name: 'Data',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: []
        };
        serie.name = (table.getColumn(0) || {}).field || 'Data';
        for (let rowIndex = 0, rowCount = table.getRowCount(); rowIndex < rowCount; rowIndex++) {
            let item = {
                name: table.getValue(rowIndex, 0) || ('Untitled' + rowIndex),
                value: table.getValue(rowIndex, 1) || 0
            };
            serie.data.push(item);
        }

        option.series.push(serie);
        return option;
    }
};

export default function createChartOption(chartType, data) {
    let fn = factory[chartType];
    if (fn) {
        let table = data instanceof DataTable ? data : new DataTable(data);
        return fn(table);
    }
}
