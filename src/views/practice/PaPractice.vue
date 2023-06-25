<template>
  <div style="height: 100%">
    <n-card size="small" hoverable style="height: 8%">
      <n-space :vertical="false" size="small" justify="space-between">
        <n-space size="small">
          <pool-stock-random-selector v-model:k-line="condition.kLine"/>
        </n-space>
        <n-space size="small">
          <n-input size="small" v-model:value="condition.showKNum" placeholder="显示K线数量" title="显示K线数量" style="width: 60px"/>
          <n-switch title="显示后置行为" v-model:value="condition.show"/>
        </n-space>
      </n-space>
    </n-card>
    <n-card size="small" hoverable style="height: 92%">
      <practice-panel :k-line="condition.kLine" :show="condition.show" :show-k-num="condition.showKNum"/>
    </n-card>
  </div>
</template>

<script>

import {defineComponent, reactive, watch} from "vue";
import PaSelector from "cc/PaSelector.vue";
import StockSelector from "cc/StockSelector.vue";
import PoolStockRandomSelector from "cc/PoolStockRandomSelector.vue";
import PracticePanel from "vv/practice/PracticePanel.vue";

export default defineComponent({
  name: "PaPractice",
  components: {
    PracticePanel,
    PoolStockRandomSelector,
    StockSelector,
    PaSelector
  },
  setup() {
    const condition = reactive({
      kLine: {
        data: [],
        endIndex: 0,
      },
      show: false,
      showKNum: 200,
    })

    return {
      condition
    }
  }
})
</script>

<style scoped>

</style>