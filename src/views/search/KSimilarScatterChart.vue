<template>
  <div style="height: 100%; width: 100%; padding: 0;">
    <n-space :vertical="false" size="small" justify="space-between">
      <n-space size="small">
        <n-tr size="small">
          <td title="上涨概率" style="background-color: gainsboro">⬆</td>
          <td :title="`P(short>${th.short})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(short>${th.short})`))}">{{ expressionProbability(`P(short>${th.short})`) }}</td>
          <td :title="`P(mid>${th.mid})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(mid>${th.mid})`))}">{{ expressionProbability(`P(mid>${th.mid})`) }}</td>
          <td :title="`P(long>${th.long})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(long>${th.long})`))}">{{ expressionProbability(`P(long>${th.long})`) }}</td>
          <td :title="`P(mid>${th.mid}|short>${th.short})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(mid>${th.mid}|short>${th.short})`))}">{{ expressionProbability(`P(mid>${th.mid}|short>${th.short})`) }}</td>
          <td :title="`P(long>${th.long}|mid>${th.mid})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(long>${th.long}|mid>${th.mid})`))}">{{ expressionProbability(`P(long>${th.long}|mid>${th.mid})`) }}</td>
          <td :title="`P(long>${th.long}|short>${th.short},mid>${th.mid})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(long>${th.long}|short>${th.short},mid>${th.mid})`))}">{{ expressionProbability(`P(long>${th.long}|short>${th.short},mid>${th.mid})`) }}</td>
          <td title="下跌概率" style="background-color: gainsboro">⬇</td>
          <td :title="`P(short<-${th.short})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(short<-${th.short})`))}">{{ expressionProbability(`P(short<-${th.short})`) }}</td>
          <td :title="`P(mid<-${th.mid})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(mid<-${th.mid})`))}">{{ expressionProbability(`P(mid<-${th.mid})`) }}</td>
          <td :title="`P(long<-${th.long})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(long<-${th.long})`))}">{{ expressionProbability(`P(long<-${th.long})`) }}</td>
          <td :title="`P(mid<-${th.mid}|short<-${th.short})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(mid<-${th.mid}|short<-${th.short})`))}">{{ expressionProbability(`P(mid<-${th.mid}|short<-${th.short})`) }}</td>
          <td :title="`P(long<-${th.long}|mid<-${th.mid})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(long<-${th.long}|mid<-${th.mid})`))}">{{ expressionProbability(`P(long<-${th.long}|mid<-${th.mid})`) }}</td>
          <td :title="`P(long<-${th.long}|short<-${th.short},mid<-${th.mid})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(long<-${th.long}|short<-${th.short},mid<-${th.mid})`))}">{{ expressionProbability(`P(long<-${th.long}|short<-${th.short},mid<-${th.mid})`) }}</td>
          <td title="波动概率" style="background-color: gainsboro">~</td>
          <td :title="`P(short<${th.short},short>-${th.short})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(short<${th.short},short>-${th.short})`))}">{{ expressionProbability(`P(short<${th.short},short>-${th.short})`) }}</td>
          <td :title="`P(mid<${th.mid},mid>-${th.mid})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(mid<${th.mid},mid>-${th.mid})`))}">{{ expressionProbability(`P(mid<${th.mid},mid>-${th.mid})`) }}</td>
          <td :title="`P(long<${th.long},long>-${th.long})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(long<${th.long},long>-${th.long})`))}">{{ expressionProbability(`P(long<${th.long},long>-${th.long})`) }}</td>
          <td :title="`P(mid<${th.mid},mid>-${th.mid}|short<${th.short},short>-${th.short})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(mid<${th.mid},mid>-${th.mid}|short<${th.short},short>-${th.short})`))}">{{ expressionProbability(`P(mid<${th.mid},mid>-${th.mid}|short<${th.short},short>-${th.short})`) }}</td>
          <td :title="`P(long<${th.long},long>-${th.long}|mid<${th.mid},mid>-${th.mid})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(long<${th.long},long>-${th.long}|mid<${th.mid},mid>-${th.mid})`))}">{{ expressionProbability(`P(long<${th.long},long>-${th.long}|mid<${th.mid},mid>-${th.mid})`) }}</td>
          <td :title="`P(long<${th.long},long>-${th.long}|mid<${th.mid},mid>-${th.mid},short<${th.short},short>-${th.short})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(long<${th.long},long>-${th.long}|mid<${th.mid},mid>-${th.mid},short<${th.short},short>-${th.short})`))}">{{ expressionProbability(`P(long<${th.long},long>-${th.long}|mid<${th.mid},mid>-${th.mid},short<${th.short},short>-${th.short})`) }}</td>
          <td title="重要概率" style="background-color: gainsboro">*</td>
          <td :title="`P(short>${th.short},mid>${th.mid})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(short>${th.short},mid>${th.mid})`))}">{{ expressionProbability(`P(short>${th.short},mid>${th.mid})`) }}</td>
          <td :title="`P(short>${th.short},mid>${th.mid},long>${th.long})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(short>${th.short},mid>${th.mid},long>${th.long})`))}">{{ expressionProbability(`P(short>${th.short},mid>${th.mid},long>${th.long})`) }}</td>
          <td :title="`P(short<-${th.short},mid<-${th.mid},long<-${th.long})`" :style="{'background-color': getBKColor(expressionProbabilityVal(`P(short<-${th.short},mid<-${th.mid},long<-${th.long})`))}">{{ expressionProbability(`P(short<-${th.short},mid<-${th.mid},long<-${th.long})`) }}</td>
        </n-tr>
      </n-space>
      <n-space size="small">
        <n-tr size="small">
          <n-td size="small" :title="points.expression" :style="{'background-color': getBKColor(expressionProbabilityVal(points.expression))}">{{ expressionProbability(points.expression) }}</n-td>
          <n-td size="small" ><n-input v-model:value="points.expression" style="width: 200px" size="small" placeholder="P(..|..)"/></n-td>
          <n-td size="small" ><n-input v-model:value="th.short" style="width: 40px" size="small"/></n-td>
          <n-td size="small" ><n-input v-model:value="th.mid" style="width: 40px" size="small"/></n-td>
          <n-td size="small" ><n-input v-model:value="th.long" style="width: 40px" size="small"/></n-td>
        </n-tr>
      </n-space>
    </n-space>
    <scatter-chart :points-arr="points.arr" y-tip="Long" x-tip="Mid" z-tip="Short" :x-max="40" :y-max="100"
                   :z-max="20"/>
  </div>
</template>

<script>
import {defineComponent, reactive, toRaw, watch} from "vue";
import ScatterChart from "vv/bubble/ScatterChart.vue";
import dayjs from "dayjs";
import chroma from 'chroma-js'
import {calculateProbability} from "./probability";

export default defineComponent({
  name: "KSimilarScatterChart",
  components: {ScatterChart},
  props: {
    kLines: Object,
    similarityDict: Object,
    laterDay: Object,
    kSize: Number,
  },
  setup(props) {
    const template = "YYYY-MM-DD"
    const points = reactive({
      arr: [],
      expression: 'P(short>0)',
    })
    const th = reactive({
      short: 0.1,
      mid: 1,
      long: 5,
    })

    function getColor(value, max) {
      const min = -max;
      value = Math.min(Math.max(value, min), max);
      const hue = ((value - min) / (max - min)) * 120;
      return `hsl(${hue}, 100%, 50%)`;
    }

    const chroma_scale_green = chroma.scale(['#F0FA18', '#18FA26'])
    const chroma_scale_red = chroma.scale(['#FF6546', '#F0FA18'])

    function getBKColor(val) {
      if (val >= 50) {
        return chroma_scale_green((val - 50) / 50).hex()
      } else {
        return chroma_scale_red(val / 50).hex()
      }
    }

    function update(newSimilarityDictData) {
      const similarityDict = toRaw(newSimilarityDictData)
      const kLines = toRaw(props.kLines)
      const laterDay = toRaw(props.laterDay)
      const kSize = toRaw(props.kSize)

      const pointsArr = []

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

            pointsArr.push({
              coordinate: [m_p, l_p],
              size: 10 + similarityDict[alias][index] * 10,
              color: getColor(s_p, 10),
              name: alias + '<br>' + dayjs(aliasKLines[Number(index)]['Date']).format(template) + `<br>${similarityDict[alias][index].toFixed(2)}`,
              code: aliasKLines[Number(index)]['code'],
              closeArr: aliasKLines.slice(Number(index), f_index).map((item) => item['close']),
              zPercent: s_p,

              mid: m_p,
              long: l_p,
              short: s_p,
            })
          }
        }
      }
      points.arr = pointsArr
    }

    watch(() => props.similarityDict, (newData) => {
      update(newData)
    })

    watch(() => props.laterDay, (newData) => {
      update(props.similarityDict)
    }, {deep: true})

    function expressionProbability(expression) {
      try{
        return `${(calculateProbability(toRaw(points.arr), expression) * 100).toFixed(2)}%`
      } catch (e) {
        return '0%'
      }
    }
    function expressionProbabilityVal(expression) {
      try {
        return calculateProbability(toRaw(points.arr), expression) * 100
      }catch (e) {
        return 'white'
      }
    }

    return {
      formatPercentTooltip: (value) => `${value}%`,
      expressionProbability,
      expressionProbabilityVal,
      getBKColor,
      points,
      th,
    }
  }

})
</script>

<style scoped>

</style>