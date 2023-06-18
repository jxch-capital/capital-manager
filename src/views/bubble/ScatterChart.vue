<template>
  <v-chart ref="scatter-chart" class="scatter-chart" :option="chartOptions"/>
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted, reactive, toRaw, watch} from "vue";

export default defineComponent({
  name: "ScatterChart",
  props: {
    pointsArr: Array,
  },
  setup(props) {

    function getShortColor(value) {
      const max = 20;
      const min = -20;
      value = Math.min(Math.max(value, min), max);
      const hue = ((value - min) / (max - min)) * 120;
      return `hsl(${hue}, 100%, 50%)`;
    }

    function getMidColor(value) {
      const max = 40;
      const min = -40;
      value = Math.min(Math.max(value, min), max);
      const hue = ((value - min) / (max - min)) * 120;
      return `hsl(${hue}, 100%, 50%)`;
    }

    function getLongColor(value) {
      value = Math.max(value, -100);
      value = Math.min(value, 100);
      let hue = (value + 100) / 2 * 1.2; // 计算色调
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
          const shortPercent = toRaw(mates.series)[params['seriesIndex']]['shortPercent']
          const closeArr = toRaw(mates.series)[params['seriesIndex']]['closeArr']
          const code = toRaw(mates.series)[params['seriesIndex']]['code']
          return params['marker'] + params['seriesName'] + ' (' + code + ')' + '<br><table>'
              + '<tr><td>Close</td><td style="text-align: right;padding-left: 6px;">' + closeArr[closeArr.length - 1].toFixed(2) + ' </td></tr>'
              + '<tr><td>Short</td><td style="text-align: right;padding-left: 6px; background-color: ' + getShortColor(shortPercent) + '">' + shortPercent + ' </td></tr>'
              + '<tr><td>Mid</td><td style="text-align: right;padding-left: 6px; background-color: ' + getMidColor(params['value'][0]) + '">' + params['value'][0] + ' </td></tr>'
              + '<tr><td>Long</td><td style="text-align: right;padding-left: 6px; background-color: ' + getLongColor(params['value'][1]) + '">' + params['value'][1] + ' </td></tr>'
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

    onMounted(() => {
      chartDemo = getCurrentInstance().refs['scatter-chart']
    })

    watch(() => props.pointsArr, (newData) => {
      mates.series = newData.map((point) => {
        return {
          type: 'scatter',
          name: point['name'],
          code: point['code'],
          shortPercent: point['shortPercent'],
          closeArr: point['closeArr'],
          point: point,
          symbolSize: point['size'],
          data: [point['coordinate']],
          itemStyle: {
            color: point['color'],
          }
        }
      })

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
      chartOptions.series = mates.series
      chartDemo.setOption(chartOptions, true)
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