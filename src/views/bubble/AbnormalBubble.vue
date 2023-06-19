<template>
  <div style="height: 100%">
    <n-card size="small" hoverable style="height: 8%">
      <n-space :vertical="false" size="small" justify="space-between">
        <n-space>
          <stock-pool-selector v-model:k-lines="stockChart.kLines"/>
          <n-form-item label="异动天数：" size="small" label-placement="left">
            <n-slider style="width: 100px" :default-value="stockChart.lastDay" :step="1"
                      :min="2" :max="20" v-model:value="stockChart.lastDay"
                      :format-tooltip="formatAbPercentTooltip"/>
          </n-form-item>
        </n-space>
        <n-space>
          <p>量价时空：纵轴代表成交量，横轴代表成交量变化，散点大小和颜色代码价格变化</p>
        </n-space>
      </n-space>
    </n-card>
    <n-card size="small" hoverable style="height: 92%">
      <abnormal-scatter-chart :k-lines="stockChart.kLines" :last-day="stockChart.lastDay"/>
    </n-card>
  </div>
</template>

<script>
import {computed, defineComponent, reactive, toRaw} from "vue";
import DateSelector from "cc/DateSelector.vue";
import {useMessage} from "naive-ui";
import {apis} from "@/api";
import dayjs from "dayjs";
import StockPoolSelector from "cc/StockPoolSelector.vue";
import MarketScatterChart from "vv/bubble/MartketScatterChart.vue";
import AbnormalScatterChart from "vv/bubble/AbnormalScatterChart.vue";

export default defineComponent({
  name: "MarketBubble",
  components: {AbnormalScatterChart, MarketScatterChart, StockPoolSelector, DateSelector},

  setup() {
    const stockChart = reactive({
      kLines: '',
      lastDay: 5,
    })

    function formatAbPercentTooltip(value) {
      return `${value}日`
    }

    return {
      formatAbPercentTooltip,
      stockChart,
    }
  }

})
</script>

<style scoped>

</style>