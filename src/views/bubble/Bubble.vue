<template>
  <div style="height: 100%">
    <n-card size="small" hoverable style="height: 8%">
      <n-space :vertical="false" size="small" justify="space-between">
        <n-space>
          <date-selector :condition="condition"/>
          <n-form-item label="中期百分比：" size="small" label-placement="left">
            <n-input-number size="small" v-model:value="stockChart.midPercent" clearable placeholder="last"
                            style="width: 110px"/>
          </n-form-item>
          <n-form-item label="短期百分比：" size="small" label-placement="left">
            <n-input-number size="small" v-model:value="stockChart.shortPercent" clearable placeholder="last"
                            style="width: 110px"/>
          </n-form-item>
          <n-dropdown size="small" trigger="hover" :options="stockPoolOptionsComputed" @select="stockPoolHandleSelect">
            <n-button size="small" :loading="condition.loading" @click="update">
              {{ condition.stockPoolSelectLabel }}
            </n-button>
          </n-dropdown>
        </n-space>
        <n-space>
          <p>纵轴为长期趋势，横轴为中期趋势，散点大小和颜色为短期趋势</p>
        </n-space>
      </n-space>
    </n-card>
    <n-card size="small" hoverable style="height: 92%">
      <stock-pool-scatter-chart :k-lines="stockChart.kLines"
                                :mid-percent="stockChart.midPercent" :short-percent="stockChart.shortPercent"/>
    </n-card>
  </div>
</template>

<script>
import {computed, defineComponent, onBeforeMount, reactive, toRaw} from 'vue'
import {apis} from "@/api";
import DateSelector from "cc/DateSelector.vue";
import dayjs from "dayjs";
import StockPoolScatterChart from "vv/bubble/StockPoolScatterChart.vue";

export default defineComponent({
  name: "Bubble",
  components: {StockPoolScatterChart, DateSelector},

  setup() {
    const template = "YYYY-MM-DD"
    const condition = reactive({
      last: 3,
      cycle: 'month',
      stockPool: [],
      loading: false,
      stockPoolSelectLabel: '',
      stockPoolSelectKey: '',
    })
    const stockChart = reactive({
      kLines: '',
      midPercent: 40,
      shortPercent: 15,
    })

    const stockPoolOptionsComputed = computed(() => {
      const rawStockPoolOptions = toRaw(condition.stockPool)
      return Object.keys(rawStockPoolOptions).map(key => {
        return {label: rawStockPoolOptions[key]['alias'], key: key}
      })
    })

    function queryStockPool() {
      apis.capital_service_apis.query_stock_pool().then((res) => {
        condition.stockPool = res['data']
        const keys = Object.keys(condition.stockPool)
        stockPoolHandleSelect(keys[keys.length - 1])
      })
    }

    function update() {
      condition.loading = true
      apis.capital_service_apis.query_k_json_by_stock_pool({
        "stock_pool": condition.stockPoolSelectKey,
        "start": dayjs(new Date()).subtract(condition.last, condition.cycle).format(template),
        "end": dayjs(new Date()).format(template)
      }).then((res) => {
        stockChart.kLines = res['data']
        condition.loading = false
      })
    }

    function stockPoolHandleSelect(key) {
      condition.stockPoolSelectKey = key
      condition.stockPoolSelectLabel = condition.stockPool[key]['alias']
      update()
    }

    onBeforeMount(() => queryStockPool())

    return {
      stockPoolOptionsComputed,
      stockPoolHandleSelect,
      condition,
      update,
      stockChart,
    }
  }
})
</script>

<style scoped>

</style>