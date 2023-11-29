<template>
  <div class="hot-heatmap-chart-container">
    <v-chart :option="chartOptions" class="hot-heatmap-chart"/>
  </div>
</template>

<script>
import {defineComponent, reactive, toRefs, toRaw} from 'vue'

export default defineComponent({
  name: "HotHeatmap",
  props: {
    x: Array,
    y: Array,
    heatmapData: Array,
  },
  setup(props) {
    const {x} = toRefs(props)
    const {y} = toRefs(props)
    const {heatmapData} = toRefs(props)

    const chartOptions = reactive({
      tooltip: {
        formatter: function (params) {
          const regex = /rgba\(\d+,\d+,\d+,\d+\)/;
          const match = params['marker'].match(regex);
          const rgba = match[0]
          return `${toRaw(props.y)[params['value'][1]]} <br/>
                  <tr><td>${params['marker']}</td><td>${params['name']}</td>
                      <td><span style='background: ${rgba}; margin-left: 6px'>${params['value'][2]}%</span></td></tr>`
        }
      },
      grid: {
        top: "0%",
        right: "0%",
        bottom: "0%",
        left: "0%",
      },
      xAxis: {
        type: 'category',
        data: x,
        show: false,
        splitArea: {
          show: false
        }
      },
      yAxis: {
        type: 'category',
        data: y,
        show: false,
        splitArea: {
          show: false
        }
      },
      visualMap: {
        min: -40,
        max: 40,
        calculable: true,
        show: false,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%',
        inRange: {
          color: ['#FF6546', '#F0FA18', '#18FA26'] //From smaller to bigger value ->
        }
      },
      series: [
        {
          name: '分数',
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: false
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 6,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })

    return {
      chartOptions
    }
  }
})
</script>

<style scoped>
.hot-heatmap-chart-container {
  height: 100%;
  width: 100%;
}

.hot-heatmap-chart {
  height: 100%;
  width: 100%;
}
</style>