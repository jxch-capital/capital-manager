<template>
  <scatter-chart :points-arr="points.arr" y-tip="Long" x-tip="Mid" z-tip="Short" :x-max="40" :y-max="100" :z-max="20"/>
</template>

<script>
import {defineComponent, reactive, toRaw, watch} from "vue";
import ScatterChart from "vv/bubble/ScatterChart.vue";
import dayjs from "dayjs";

export default defineComponent({
  name: "KSimilarScatterChart",
  components: {ScatterChart},
  props: {
    kLines: Object,
    similarityDict: Object,
    upside: Object,
    laterDay: Object,
    kSize: Number,
  },
  emits: ['update:upside'],
  setup(props, {emit}) {
    const template = "YYYY-MM-DD"
    const points = reactive({
      arr: []
    })

    function getColor(value, max) {
      const min = -max;
      value = Math.min(Math.max(value, min), max);
      const hue = ((value - min) / (max - min)) * 120;
      return `hsl(${hue}, 100%, 50%)`;
    }

    function update(newSimilarityDictData) {
      const similarityDict = toRaw(newSimilarityDictData)
      const kLines = toRaw(props.kLines)
      const laterDay = toRaw(props.laterDay)
      const kSize = toRaw(props.kSize)

      const pointsArr = []
      let l_up = 0
      let m_up = 0
      let s_up = 0

      for (const alias in similarityDict) {
        for (const index in similarityDict[alias]) {
          const aliasKLines = kLines[alias]
          const f_index = Number(index) + kSize

          if (aliasKLines.length > f_index + laterDay['long']) {
            const f_open = aliasKLines[f_index]['open']
            const s_close = aliasKLines[f_index + laterDay['short']]['close']
            const m_close = aliasKLines[f_index + laterDay['mid']]['close']
            const l_close = aliasKLines[f_index + laterDay['long']]['close']

            const l_p = Math.round((l_close / f_open - 1) * 10000) / 100
            const m_p = Math.round((m_close / f_open - 1) * 10000) / 100
            const s_p = Math.round((s_close / f_open - 1) * 10000) / 100

            l_up = l_p > 0 ? l_up + 1 : l_up
            m_up = m_p > 0 ? m_up + 1 : m_up
            s_up = s_p > 0 ? s_up + 1 : s_up

            pointsArr.push({
              coordinate: [m_p, l_p],
              size: 10 + similarityDict[alias][index] * 20,
              color: getColor(10 + s_p * 5, 20),
              name: alias + '<br>' + dayjs(aliasKLines[Number(index)]['Date']).format(template) + `<br>${similarityDict[alias][index].toFixed(2)}`,
              code: aliasKLines[Number(index)]['code'],
              closeArr: aliasKLines.slice(Number(index), f_index).map((item) => item['close']),
              zPercent: s_p,
            })
          }
        }
      }

      emit('update:upside', {
        long: Math.round(l_up / pointsArr.length * 10000) / 100,
        mid: Math.round(m_up / pointsArr.length * 10000) / 100,
        short: Math.round(s_up / pointsArr.length * 10000) / 100,
      })

      points.arr = pointsArr
    }

    watch(() => props.similarityDict, (newData) => {
      update(newData)
    })

    watch(() => props.laterDay, (newData) => {
      update(props.similarityDict)
    }, { deep: true })

    return {
      points,
    }
  }

})
</script>

<style scoped>

</style>