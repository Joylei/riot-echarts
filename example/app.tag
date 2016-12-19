<app>
    <p>chart</p>
    <ul>
        <li>
            <echart chart_type="{ 'pie' }" data="{ data }"></echart>
        </li>
        <li>
            <echart chart_type="{ 'line' }" data="{ data }"></echart>
        </li>
        <li>
            <echart chart_type="{ 'bar' }" data="{ data }"></echart>
        </li>
    </ul>

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
            height: 300px;
        }
        ul {
            width: 100%;
            display:block;
            list-style:none;
            margin:0;
            padding:0;
        }
        ul li{
            float:left;
            display: inline-block;
            margin:0;
            padding:0;
            width: 33.3%;
        }
    </style>
</app>