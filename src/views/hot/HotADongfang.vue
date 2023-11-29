<script>
import {apis} from "@/api";
import {defineComponent, reactive, watch} from "vue";
import HotHeatmap from "vv/hot/HotHeatmap.vue"
import dayjs from "dayjs";

function calculateChangeRate(previousClose, currentClose) {
  let rate = (currentClose - previousClose) / previousClose;
  return (rate * 100).toFixed(1);
}

function calculateNDayChangeRate(data, n) {
  let result = [];
  for(let i = n-1; i < data.length; i++) {
    let changeRate = calculateChangeRate(data[i-n+1]['收盘'], data[i]['收盘']);
    result.push({date: data[i]['日期'], changeRate: changeRate});
  }
  return result;
}

const template = "YYYY-MM-DD"

export default defineComponent({
  name: "Breaths",
  components: {HotHeatmap},
  setup() {
    const heap = reactive({
      table: [],
      data5: [],
      data20: [],
      data60: [],
      x5: [],
      x20: [],
      x60: [],
      y: [],
      symbols: [],
      start_date: '20230101',
      end_date: dayjs(new Date()).format('YYYYMMDD'),
      adjust: 'hfq',
      period: '日k'
    })

    apis.aktools_apis.api_public('stock_board_industry_name_em',{}).then(res => {
      heap.symbols = res['data'].map(item => item['板块名称']).map(value => ({symbol:value, name:value}))
      heap.symbols.forEach(item => {
        const symbol = item['symbol']
        apis.aktools_apis.api_public('stock_board_industry_hist_em', {
          symbol: symbol,
          start_date: heap.start_date,
          end_date: heap.end_date,
          adjust: heap.adjust,
          period: heap.period,
        }).then((res) => {
          heap.table.push({
            'symbol': symbol,
            'name': item['name'],
            'data': res['data'],
          })
        })
      })
    })

    watch(heap.table, (newV, oldV) => {
      if (newV.length > heap.symbols.length - 10 && newV.length % 10 === 0) {
        heap.data5 = []
        heap.x5 = []
        heap.x20 = []
        heap.x60 = []
        heap.y = []

        newV.forEach((item, ti) => {
          const rd5 = calculateNDayChangeRate(item['data'], 5)
          heap.data5 = heap.data5.concat(rd5.map((value, index) => [index, ti, value['changeRate']]))
          heap.x5 = rd5.map(item => dayjs(item['date']).format(template))
          heap.y.push(item['name'])

          const rd20 = calculateNDayChangeRate(item['data'], 20)
          heap.data20 = heap.data20.concat(rd20.map((value, index) => [index, ti, value['changeRate']]))
          heap.x20 = rd20.map(item => dayjs(item['date']).format(template))

          const rd60 = calculateNDayChangeRate(item['data'], 60)
          heap.data60 = heap.data60.concat(rd60.map((value, index) => [index, ti, value['changeRate']]))
          heap.x60 = rd60.map(item => dayjs(item['date']).format(template))
        })
      }
    })

    const heightPX = (window.innerHeight / 3 - 22).toFixed(0) + 'px'
    console.log(heightPX)
    return {
      heap,
      heightPX,
    }
  }
})

</script>

<template>
  <n-space :vertical="true" size="small">
    <n-card size="small" hoverable :style="{height: heightPX}">
      <hot-heatmap :x="heap.x5"
                :y="heap.y"
                :heatmap-data="heap.data5"/>
    </n-card>
    <n-card size="small" hoverable :style="{height: heightPX}">
      <hot-heatmap :x="heap.x20"
                   :y="heap.y"
                   :heatmap-data="heap.data20"/>
    </n-card>
    <n-card size="small" hoverable :style="{height: heightPX}">
      <hot-heatmap :x="heap.x60"
                   :y="heap.y"
                   :heatmap-data="heap.data60"/>
    </n-card>
    <n-card size="small" hoverable>
      {{ heap.table.length }} / {{ heap.symbols.length }}
    </n-card>
  </n-space>
</template>

<style scoped>

</style>