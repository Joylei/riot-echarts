// rollup.config.js
import typescript from 'rollup-plugin-typescript'
import resolve from 'rollup-plugin-node-resolve'
import buble from 'rollup-plugin-buble'

export default {
  entry: './src/index.ts',
  dest: 'dist/riot-echarts.js',
  format: 'umd',
  moduleName: 'riotECharts',
  moduleId: 'riot-echarts',
  exports: 'default',
  sourceMap: true,
  external:['riot', 'echarts'],
  globals: {
    riot:'riot',
    echarts:'echarts'
  },
  plugins: [
    typescript(),
    resolve({
      jsnext: true,
      main: true
    }),
    buble({
      modules: true
    })
  ]
}
