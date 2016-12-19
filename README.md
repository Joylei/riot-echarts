# riot-echarts

a no-brainer riot tag to display charts easily with [Baidu ECharts](https://github.com/ecomfe/echarts), like Google Chart does.

## usage

```html
<app>
    <p>chart</p>
    <echart chart_type="{ 'pie' }" data="{ data }"></echart>
    <script>
        this.data = [
            ['name', 'value'],
            ['a', 10],
            ['b', 20],
            ['c', 25],
            ['d', 15],
            ['e', 55]
        ]
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

For more information, see example.

## License

MIT