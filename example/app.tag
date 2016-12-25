<app>
    <p>chart examples</p>
    <ul>
        <li>
            <h1>Pie</h1>
            <echart simple="{ {type:'pie', data: data} }"></echart>
        </li>
        <li>
            <h1>Line</h1>
            <echart simple="{ {type:'line', data: data} }"></echart>
        </li>
        <li>
            <h1>Bar</h1>
            <echart simple="{ {type:'bar', data: data} }"></echart>
        </li>
    </ul>
    <p>
        <h1>Thenable data</h1>
        <echart simple="{ {type:'bar', data: thenable} }"></echart>
    </p>
    <p>
        <h1>Callback data</h1>
        <echart simple="{ {type:'bar', data: callback} }"></echart>
    </p>

    <p>
        <h1>Direct Option</h1>
        <echart option="{ option }"></echart>
    </p>

    <script>
        var self = this
        this.data = [
            ['name', 'value'],
            ['a', 10],
            ['b', 20],
            ['c', 25],
            ['d', 15],
            ['e', 55]
        ]
        this.thenable = {
            then: function(onSuccess, onError){
                setTimeout(function(){
                    onSuccess(self.data)
                }, 3000)
            }
        }
        this.callback = function(cb){
            setTimeout(function(){
                cb(null, self.data)
            }, 3000)
        }
        this.option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            series: [
                {
                    name: 'Data',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: [
                        { name: 'a', value: 10 },
                        { name:'b', value:20 },
                        {name:'c', value: 25},
                        {name:'d', value: 15},
                        {name:'e', value:55}
                    ]
                }
            ]
        }
        
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