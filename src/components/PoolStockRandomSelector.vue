<template>
  <n-space size="small">
    <date-selector title="随机结束时间的范围：开始时间+它 && 结束时间-它" v-model:condition="condition"/>
    <n-date-picker size="small" v-model:value="condition.range" type="daterange" clearable style="width: 260px" />
    <n-dropdown size="small" trigger="hover" :options="stockPoolOptionsComputed" @select="stockPoolHandleSelect">
      <n-button size="small" @click="update" :loading="condition.loading_pool">
        {{ condition.stockPoolSelectLabel }}
      </n-button>
    </n-dropdown>
    <n-input size="small" v-model:value="condition.alias" :title="condition.alias" :disabled="true" placeholder="Alias" style="width: 80px"/>
    <n-input size="small" v-model:value="condition.code" :title="condition.code" :disabled="true" placeholder="Code" style="width: 80px"/>
    <n-input size="small" v-model:value="condition.interval" :title="condition.interval" :disabled="true" placeholder="Interval" style="width: 40px"/>
    <n-input size="small" v-model:value="condition.end_date" :title="`随机结束时间：${condition.end_date}`" :disabled="true" placeholder="end-date" style="width: 100px"/>
    <n-button size="small" :loading="condition.loading_update" @click="update">Random Next ➡</n-button>
  </n-space>
</template>
<script>
import {computed, defineComponent, reactive, toRaw} from "vue";
import DateSelector from "cc/DateSelector.vue";
import dayjs from "dayjs";
import {apis} from "@/api";
import {useMessage} from "naive-ui";
import {useStore} from "vuex";

export default defineComponent({
  name: "PoolStockRandomSelector",
  components: {DateSelector},
  props: {
    kLine: Object,
  },
  emits: ['update:kLine'],
  setup(props, {emit}) {
    const store = useStore()
    const message = useMessage()
    const template = "YYYY-MM-DD"
    const condition = reactive({
      last: 3,
      cycle: 'month',
      interval: '1d',
      end_date: '',
      range: [dayjs("2000-01-01", template).valueOf(), Date.now()],
      code: 'QQQ',
      alias: 'QQQ',
      service_code: 'yf',
      loading_update: false,
      loading_pool: false,
      kLine: {
        data: {},
        endIndex: 0,
      },
      stockPool: {},
      stockPoolSelectLabel: '',
      stockPoolSelectKey: '',
    })

    function updateStockPool() {
      const codes = condition.stockPool[condition.stockPoolSelectKey]['codes']
      const alias = condition.stockPool[condition.stockPoolSelectKey]['codes_alias']
      const index = Math.floor(Math.random() * codes.length)
      condition.code = codes[index]
      condition.alias = alias[index]
      condition.end_date = ''
    }

    function update() {
      updateStockPool()
      condition.loading_update = true
      apis.capital_service_apis.query_k_json({
        "service_code": condition.service_code,
        "codes": [condition.code],
        "start": dayjs(condition.range[0]).format(template),
        "end": dayjs(condition.range[1]).format(template)
      }).then(res => {
        condition.kLine.data = res['data'][condition.code]

        const startTimestamp = Math.max(dayjs(condition.range[0]).add(condition.last, condition.cycle).valueOf(),
            dayjs(res['data'][condition.code][0]['date']).add(condition.last, condition.cycle).valueOf())
        const endTimestamp = dayjs(condition.range[1]).subtract(condition.last, condition.cycle)
        const randomTimestamp = Math.floor(Math.random() * (endTimestamp - startTimestamp)) + startTimestamp;

        const dates = res['data'][condition.code]
        let closestIndex = dates.reduce((acc, curr, index) => {
          let currDiff = Math.abs(curr['date'] - randomTimestamp);
          let accDiff = Math.abs(dates[acc]['date'] - randomTimestamp);
          return currDiff < accDiff ? index : acc;
        }, 0);
        const closestIndexTimestamp = dayjs(res['data'][condition.code][closestIndex]['date']).valueOf()

        condition.end_date = dayjs(closestIndexTimestamp).format(template)
        condition.kLine.endIndex = closestIndex

        emit('update:kLine', condition.kLine)
      }).catch(e => {
        console.log(e)
        message.error(`查询报错：${e['massage']}`)
      }).finally(() => {
        condition.loading_update = false
      })
    }

    const stockPoolOptionsComputed = computed(() => {
      const rawStockPoolOptions = toRaw(condition.stockPool)
      return Object.keys(rawStockPoolOptions).map(key => {
        return {label: rawStockPoolOptions[key]['alias'] + ` (${rawStockPoolOptions[key]['codes'].length})`, key: key}
      })
    })

    function stockPoolHandleSelect(key) {
      condition.stockPoolSelectKey = key
      condition.stockPoolSelectLabel = condition.stockPool[key]['alias'] + ` (${condition.stockPool[key]['codes'].length})`
      update()
    }

    function queryStockPool() {
      if (Object.keys(store.state.stockPool).length > 0) {
        condition.stockPool = store.state.stockPool
        const keys = Object.keys(condition.stockPool)
        stockPoolHandleSelect(keys[keys.length - 1])
        return
      }

      condition.loading_pool = true
      apis.capital_service_apis.query_stock_pool().then((res) => {
        condition.stockPool = res['data']
        store.commit('setStockPool', {pool:res['data']})
        const keys = Object.keys(condition.stockPool)
        stockPoolHandleSelect(keys[keys.length - 1])
      }).catch((e) => {
        console.log(e)
        message.warning('请检查网络并稍后重试，或查看控制台报错信息：' + e['message'])
      }).finally(()=>{
        condition.loading_pool = false
      })
    }

    queryStockPool()
    return {
      condition,
      update,
      stockPoolHandleSelect,
      stockPoolOptionsComputed,
      updateStockPool,
    }
  }

})
</script>
<style scoped>

</style>