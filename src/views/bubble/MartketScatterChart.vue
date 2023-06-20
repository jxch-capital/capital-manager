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
import {defineComponent, reactive, toRaw, toRefs, watch} from "vue";
import ScatterChart from "vv/bubble/ScatterChart.vue";
import {calculateProbability} from "vv/search/probability"
import chroma from 'chroma-js'

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
      arr: [],
      expression: 'P(short>0)',
    })
    const th = reactive({
      short: 0.1,
      mid: 1,
      long: 5,
    })

    function getColor(value) {
      value = Math.max(value, -100); // 将小于 -100 的值按 -100 算
      value = Math.min(value, 100); // 将大于 100 的值按 100 算
      let hue = (value + 100) / 2 * 1.2; // 计算色调
      return `hsl(${hue}, 100%, 50%)`;
    }

    function update(newData) {
      const rawData = toRaw(newData)
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
          mid: m_p,
          long: l_p,
          short: s_p,
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

    const chroma_scale_green = chroma.scale(['#F0FA18', '#18FA26'])
    const chroma_scale_red = chroma.scale(['#FF6546', '#F0FA18'])

    function getBKColor(val) {
      if (val >= 50) {
        return chroma_scale_green((val - 50) / 50).hex()
      } else {
        return chroma_scale_red(val / 50).hex()
      }
    }

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

    update(props.kLines)

    return {
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