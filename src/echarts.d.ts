declare module 'echarts/dist/echarts'{
  var echartStatic: {
    init(el:HTMLElement);
    setOption(option:any);
  };

  export = echartStatic;
}
