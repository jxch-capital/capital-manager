<template>
  <v-chart class="practice-k-line-chart" :option="chartOptions"/>
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted, reactive, toRefs, watch, toRaw} from "vue";

export default defineComponent({
  name: "PracticeKLineChart",
  props: {
    dataArr: Array,
    dataZoomStart: Number,
    dataZoomEnd: Number,
    endX: String,
  },
  setup(props) {
    const {dataArr, dataZoomStart, dataZoomEnd, endX} = toRefs(props)
    const upColor = '#00da3c';
    const upBorderColor = '#008F28';
    const downColor = '#ec0000';
    const downBorderColor = '#8A0000';
    const crossColor = 'gray';
    const crossBorderColor = 'gray';

    const chartOptions = reactive({
      dataset: {
        source: dataArr
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        }
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: false
          }
        }
      },
      grid: [
        {
          left: '2%',
          right: '2%',
          bottom: 100
        },
        {
          left: '2%',
          right: '2%',
          height: 40,
          bottom: 40
        }
      ],
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          // inverse: true,
          axisLine: {onZero: false},
          splitLine: {show: false},
          min: 'dataMin',
          max: 'dataMax'
        },
        {
          type: 'category',
          gridIndex: 1,
          boundaryGap: false,
          axisLine: {onZero: false},
          axisTick: {show: false},
          splitLine: {show: false},
          axisLabel: {show: false},
          min: 'dataMin',
          max: 'dataMax'
        }
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true
          }
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: {show: false},
          axisLine: {show: false},
          axisTick: {show: false},
          splitLine: {show: false}
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: dataZoomStart,
          end: dataZoomEnd
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          bottom: 10,
          start: 10,
          end: 100
        }
      ],
      visualMap: {
        show: false,
        seriesIndex: 1,
        dimension: 6,
        pieces: [
          {
            value: 1,
            color: upColor
          },
          {
            value: -1,
            color: downColor
          },
          {
            value: 0,
            color: crossColor
          }
        ]
      },
      series: [
        {
          type: 'candlestick',
          itemStyle: {
            color: upColor,
            color0: downColor,
            color1: crossColor,
            borderColor: upBorderColor,
            borderColor0: downBorderColor,
            borderColor1: crossBorderColor,
          },
          encode: {
            x: 0,
            y: [1, 4, 3, 2]
          },
          markLine: {
            symbol: 'none',
            label: {
              show: false
            },
            lineStyle: {
              type: 'dashed'
            },
            data: [
              {
                xAxis: endX
              }
            ],
            z: 0,
          }
        },
        {
          name: 'Volumn',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            color: '#7fbe9e'
          },
          large: true,
          encode: {
            x: 0,
            y: 5
          }
        }, {
          name: "SMA20",
          type: "line",
          encode: {
            x: 0,
            y: 7,
          },
          symbol: "circle",
          symbolSize: 1,
          smooth: 0,
          lineStyle: {
            color: "orange", // 线条颜色
            width: 1
          },
          itemStyle: {
            color: "orange"
          },
        }
      ]
    })

    function update(newData) {
      chartOptions.dataset.source = toRaw(newData)
    }

    watch(() => props.dataArr, (newData) => {
      update(newData)
      console.log(toRaw(props.dataZoomStart), toRaw(props.dataZoomEnd))
    })

    return {
      chartOptions
    }
  }
})
</script>

<style scoped>
.practice-k-line-chart {
  height: 100%;
  width: 100%;
}
</style>