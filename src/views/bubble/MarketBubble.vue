<template>
  <div style="height: 100%">
    <n-card size="small" hoverable style="height: 8%">
      <n-space :vertical="false" size="small" justify="space-between">
        <n-space>
          <stock-pool-selector v-model:k-lines="stockChart.kLines"/>
          <n-form-item label="中期百分比：" size="small" label-placement="left">
            <n-slider style="width: 100px" :default-value="stockChart.midPercent" :step="1"
                      :min="10" :max="80" v-model:value="stockChart.midPercent"
                      :format-tooltip="formatPercentTooltip"/>
          </n-form-item>
          <n-form-item label="短期百分比：" size="small" label-placement="left">
            <n-slider style="width: 100px" :default-value="stockChart.shortPercent" :step="1"
                      :min="1" :max="50" v-model:value="stockChart.shortPercent"
                      :format-tooltip="formatPercentTooltip"/>
          </n-form-item>
        </n-space>
        <n-space>
          <p>纵轴为长期趋势，横轴为中期趋势，散点大小和颜色为短期趋势</p>
        </n-space>
      </n-space>
    </n-card>
    <n-card size="small" hoverable style="height: 92%">
      <market-scatter-chart :k-lines="stockChart.kLines"
                            :mid-percent="stockChart.midPercent" :short-percent="stockChart.shortPercent"/>
    </n-card>
  </div>
</template>

<script>
import {computed, defineComponent, onBeforeMount, reactive, toRaw} from 'vue'
import {apis} from "@/api";
import DateSelector from "cc/DateSelector.vue";
import dayjs from "dayjs";
import MarketScatterChart from "vv/bubble/MartketScatterChart.vue";
import {useMessage} from "naive-ui";
import StockPoolSelector from "cc/StockPoolSelector.vue";

export default defineComponent({
  name: "MarketBubble",
  components: {StockPoolSelector, MarketScatterChart, DateSelector},

  setup() {
    const stockChart = reactive({
      kLines: '',
      midPercent: 40,
      shortPercent: 15,
    })

    function formatPercentTooltip(value) {
      return `${value}%`
    }

    return {
      formatPercentTooltip,
      stockChart,
    }
  }
})
</script>

<style scoped>

</style>