<template>
  <v-chart ref="scatter-chart" class="scatter-chart" :option="chartOptions"/>
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted, reactive, toRaw, toRefs, watch} from "vue";

export default defineComponent({
  name: "ScatterChart",
  props: {
    pointsArr: Array,
    xTip: String,
    yTip: String,
    zTip: String,
    xMax: Number,
    yMax: Number,
    zMax: Number,
    enableDashed: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    function getColor(value, max) {
      const min = -max;
      value = Math.min(Math.max(value, min), max);
      const hue = ((value - min) / (max - min)) * 120;
      return `hsl(${hue}, 100%, 50%)`;
    }

    function closeSvg(data, width, height, color, strokeWidth) {
      const maxValue = Math.max(...data);
      const minValue = Math.min(...data);
      const xStep = width / (data.length - 1);

      let svg = `<svg width="${width}" height="${height}">`;
      svg += `<polyline points="`;

      data.forEach((value, index) => {
        const y = ((value - minValue) / (maxValue - minValue)) * height;
        const x = index * xStep;
        svg += `${x},${height - y} `;
      });

      svg += `" style="fill:none;stroke:${color};stroke-width:${strokeWidth}" />`;
      svg += '</svg>';

      return svg
    }

    const mates = reactive({
      series: []
    })
    const chartOptions = reactive({
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          const zPercent = toRaw(mates.series)[params['seriesIndex']]['zPercent']
          const xPercent = toRaw(mates.series)[params['seriesIndex']]['xPercent'] ? toRaw(mates.series)[params['seriesIndex']]['xPercent'] : params['value'][0]
          const yPercent = toRaw(mates.series)[params['seriesIndex']]['yPercent'] ? toRaw(mates.series)[params['seriesIndex']]['yPercent'] : params['value'][1]
          const closeArr = toRaw(mates.series)[params['seriesIndex']]['closeArr']
          const code = toRaw(mates.series)[params['seriesIndex']]['code']
          return params['marker'] + params['seriesName'] + ' (' + code + ')' + '<br><table>'
              + '<tr><td>Close</td><td style="text-align: right;padding-left: 6px;">' + closeArr[closeArr.length - 1].toFixed(2) + ' </td></tr>'
              + `<tr><td>${toRaw(props.zTip)}</td><td style="text-align: right;padding-left: 6px; background-color: ` + getColor(zPercent, toRaw(props.zMax)) + '">' + zPercent + ' </td></tr>'
              + `<tr><td>${toRaw(props.xTip)}</td><td style="text-align: right;padding-left: 6px; background-color: ` + getColor(xPercent, toRaw(props.xMax)) + '">' + xPercent + ' </td></tr>'
              + `<tr><td>${toRaw(props.yTip)}</td><td style="text-align: right;padding-left: 6px; background-color: ` + getColor(yPercent, toRaw(props.yMax)) + '">' + yPercent + ' </td></tr>'
              + '</table>' + closeSvg(closeArr, 90, 20, 'black', 0.6)
        }
      },
      grid: {
        left: '0',
        right: '0',
        bottom: '0',
        containLabel: true
      },
      xAxis: {
        show: false
      },
      yAxis: {
        show: false
      },
      series: [],
    })

    let chartDemo = getCurrentInstance().refs['scatter-chart']

    function update(newData) {
      mates.series = newData.map((point) => {
        return {
          type: 'scatter',
          name: point['name'],
          code: point['code'],
          zPercent: point['zPercent'],
          xPercent: point['xPercent'],
          yPercent: point['yPercent'],
          closeArr: point['closeArr'],
          point: point,
          symbolSize: point['size'],
          data: [point['coordinate']],
          itemStyle: {
            color: point['color'],
          }
        }
      })
      if (toRaw(props.enableDashed)) {
        mates.series.push({
          type: 'scatter',
          data: [],
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
                xAxis: 0
              },
              {
                yAxis: 0
              },
              {
                xAxis: 50
              },
              {
                yAxis: 50
              },
              {
                xAxis: -50
              },
              {
                yAxis: -50
              },
              {
                xAxis: 100
              },
              {
                yAxis: 100
              },
              {
                xAxis: -100
              },
              {
                yAxis: -100
              },
              {
                xAxis: 20
              },
              {
                yAxis: 20
              },
              {
                xAxis: -20
              },
              {
                yAxis: -20
              },
            ],
            z: 0,
          }
        })
      }
      chartOptions.series = mates.series
      chartDemo.setOption(chartOptions, true)
    }

    onMounted(() => {
      chartDemo = getCurrentInstance().refs['scatter-chart']
      update(props.pointsArr)
    })

    watch(() => props.pointsArr, (newData) => {
      update(newData)
    })

    return {
      chartOptions,
    }
  }
})
</script>

<style scoped>
.scatter-chart {
  height: 100%;
  width: 100%;
}
</style>