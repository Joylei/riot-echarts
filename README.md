# riot-echarts

a no-brainer riot tag to display charts easily with [Baidu ECharts](https://github.com/ecomfe/echarts), like Google Chart does.

![riot-echarts demo](./demo.jpg)

## Features

- take advantage of [ECharts](https://github.com/ecomfe/echarts)

- easy to present data with a DataTable structure. You'll feel familiar with this if you have used Google Charts,

- friendly to SQL queries(no row-column transforms)

## usage

import ECharts or use CDN

```sh
https://cdn.bootcss.com/echarts/3.3.2/echarts.min.js
```

install riot-echarts
```sh
npm install riot-echarts --save
```

import riot-echarts
```js
import 'riot-echarts'
```

```html
<app>
    <p>chart</p>
    <echart simple="{ option }"></echart>
    <script>
        this.option = {type:'pie',
            data: [
                ['name', 'value'],
                ['a', 10],
                ['b', 20],
                ['c', 25],
                ['d', 15],
                ['e', 55]
            ]
        }
    </script>
    <style>
        echart {
            display:block;
            width: 100%;
            height: 500px;
        }
    </style>
</app>
```

Note: the container of charts must be visible and have determined height and width before chart rendering.

For more information, see example.

## riot echart tag supported attributes

### simple attribute

```ts
simple={type:string, data, color:Array<string>}
```

type: pie | bar | line

data:

- can be an array, first line of which are columns

- can be can DataTable object

- can be an thenable object, which eventually be resolved to an array or DataTable

- can be an function that returns array,DataTable or thenable

- can be an function that accept an callback and eventually be resolved to an array or DataTable

color: color sheets, if not provided will use built-in ones

### option attribute

```ts
option={}
```

You can provide ECharts option directly by this attribute. see docs of [ECharts](https://github.com/ecomfe/echarts) for usages.

## Plans

- add more chart types

- make DataTable headers more meaningful for chart types and other informations

- make it extensible for custom chart types

## License

MIT