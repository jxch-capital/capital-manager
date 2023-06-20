<template>
  <scatter-chart :points-arr="points.arr" x-tip="VOL动量" y-tip="VOL总量M" z-tip="价格动量" :x-max="100" :y-max="500" :z-max="10" :enable-dashed="false"/>
</template>

<script>
import {defineComponent, reactive, toRaw, watch} from "vue";
import ScatterChart from "vv/bubble/ScatterChart.vue";

export default defineComponent({
  name: "AbnormalScatterChart",
  components: {ScatterChart},
  props: {
    kLines: Object,
    lastDay: Number,
  },
  setup(props) {
    const points = reactive({
      arr: []
    })

    function getColor(value, max) {
      const min = -max;
      value = Math.min(Math.max(value, min), max);
      const hue = ((value - min) / (max - min)) * 120;
      return `hsl(${hue}, 100%, 50%)`;
    }

    function update(newData) {
      const rawData =  toRaw(newData)
      const lastDay = toRaw(props.lastDay)

      points.arr = Object.keys(rawData).map((key => {
        const len = rawData[key].length
        const f_volume = rawData[key][len-lastDay]['volume']
        const f_open = rawData[key][len-lastDay]['open']
        const l_close = rawData[key][len - 1]['close']
        const l_volume = rawData[key][len - 1]['volume']

        if (f_volume === 0) {
          return {
            coordinate: [0, 0],
            size: 0,
            color: getColor(0),
            name: key,
            code: rawData[key][0]['code'],
            closeArr: rawData[key].map((item) => item['close']),
            zPercent: 0,
          }
        }

        const m_volume =  Math.round((l_volume / f_volume - 1) * 10000) / 100
        const m_close = Math.round((l_close / f_open - 1) * 10000) / 100
        const sum_volume = rawData[key].slice(-lastDay).map((item) => {return item['volume']}).reduce((acc, cur) => acc + cur, 0)

        return {
          coordinate: [Math.round(Math.log2(m_volume) * 10000) / 100, Math.round(Math.log(sum_volume) * 10000) / 100],
          size: Math.abs(Math.min(m_close * 10, 100)),
          color: getColor(m_close, 10),
          name: key,
          code: rawData[key][0]['code'],
          closeArr: rawData[key].map((item) => item['close']),
          zPercent: m_close,
          xPercent: m_volume,
          yPercent: Math.round(sum_volume / 100000000 * 10000) / 100 ? Math.round(sum_volume / 100000000 * 10000) / 100 : 0.01,
        }
      }))
    }

    watch(() => props.kLines, (newData) => {
      update(newData)
    })

    watch(() => props.lastDay, (newData) => {
      update(props.kLines)
    })

    update(props.kLines)
    return {
      points
    }
  }
})
</script>

<style scoped>

</style>