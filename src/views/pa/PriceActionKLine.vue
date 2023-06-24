<template>
  <div style="height: 100%">
    <n-card size="small" hoverable style="height: 8%">
      <n-space :vertical="false" size="small" justify="space-between">
        <n-space size="small">
          <stock-selector v-model:k-line="condition.kLine"/>
        </n-space>
        <n-space size="small">
          <pa-selector :k-line="condition.kLine" v-model:pa="condition.pa"/>
        </n-space>
      </n-space>
    </n-card>
    <n-card size="small" hoverable style="height: 92%">
      <pa-k-chart :k-line="condition.kLine" :pa="condition.pa"/>
    </n-card>
  </div>
</template>

<script>
import {computed, defineComponent, reactive, toRaw, watch} from "vue";
import DateSelector from "cc/DateSelector.vue";
import StockSelector from "cc/StockSelector.vue";
import PaSelector from "cc/PaSelector.vue";
import PaKChart from "vv/pa/PaKChart.vue";


export default defineComponent({
  name: "PriceActionKLine",
  components: {PaKChart, PaSelector, StockSelector, DateSelector},
  setup() {
    const condition = reactive({
      kLine: [],
      loading: false,
      pa: {},
    })

    return {
      condition,
    }
  }
})
</script>

<style scoped>

</style>