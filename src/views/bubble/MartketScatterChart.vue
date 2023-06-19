<template>
  <scatter-chart :points-arr="points.arr" y-tip="Long" x-tip="Mid" z-tip="Short" :x-max="40" :y-max="100" :z-max="20"/>
</template>

<script>
import {defineComponent, reactive, toRaw, toRefs, watch} from "vue";
import ScatterChart from "vv/bubble/ScatterChart.vue";
export default defineComponent({
  name: "MarketScatterChart",
  components: {ScatterChart},
  props: {
    kLines: Object,
    midPercent: Number,
    shortPercent: Number,
  },
  setup(props) {
    const {kLines, midPercent, shortPercent} = toRefs(props)
    const points = reactive({
      arr: []
    })

    function getColor(value) {
      value = Math.max(value, -100); // 将小于 -100 的值按 -100 算
      value = Math.min(value, 100); // 将大于 100 的值按 100 算
      let hue = (value + 100) / 2 * 1.2; // 计算色调
      return `hsl(${hue}, 100%, 50%)`;
    }

    function update(newData) {
      const rawData =  toRaw(newData)
      points.arr = Object.keys(rawData).map((key => {
        const f_open = rawData[key][0]['open']
        const l_close = rawData[key][rawData[key].length - 1]['close']
        const mid_index = Math.floor(rawData[key].length * (1 - props.midPercent / 100));
        const short_index = Math.floor(rawData[key].length * (1 - props.shortPercent / 100));
        const m_open = rawData[key][mid_index]['open']
        const s_open = rawData[key][short_index]['open']
        const l_p = Math.round((l_close / f_open - 1) * 10000) / 100
        const m_p = Math.round((l_close / m_open - 1) * 10000) / 100
        const s_p = Math.round((l_close / s_open - 1) * 10000) / 100
        return {
          coordinate: [m_p, l_p],
          size: Math.abs(10 + s_p * 5),
          color: getColor(10 + s_p * 5),
          name: key,
          code: rawData[key][0]['code'],
          closeArr: rawData[key].map((item) => item['close']),
          zPercent: s_p,
        }
      }))
    }

    watch(() => props.kLines, (newData) => {
      update(newData)
    })

    watch(() => props.midPercent, (newData) => {
      update(props.kLines)
    })

    watch(() => props.shortPercent, (newData) => {
      update(props.kLines)
    })

    return {
      points,
    }
  }
})
</script>

<style scoped>

</style>