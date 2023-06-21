<template>
  <div style="height: 100%">
    <n-card size="small" hoverable style="height: 8%">
      <n-space :vertical="false" size="small" justify="space-between">
        <n-space size="small">
          <stock-pool-selector v-model:k-lines="searcher.kLines" :auto-selector="true"/>
          <n-input v-model:value="searcher.lastK" size="small" style="width: 40px"/>
          <n-input-number v-model:value="searcher.kSize" size="small" style="width: 80px"/>
          <n-input size="small" style="width: 60px" v-model:value="searcher.threshold" placeholder="threshold"/>
          <n-input size="small" style="width: 80px" v-model:value="searcher.searchCodeAlias" placeholder="Alias"/>
          <div v-html="searcher.closeSvg"></div>
        </n-space>
        <n-space size="small">
          <n-slider size="small" style="width: 80px" :default-value="searcher.laterDay.long" :step="1"
                    :min="60" :max="200" v-model:value="searcher.laterDay.long"
                    :format-tooltip="formatPercentTooltip"/>
          <n-slider size="small" style="width: 80px" :default-value="searcher.laterDay.mid" :step="1"
                    :min="20" :max="100" v-model:value="searcher.laterDay.mid"
                    :format-tooltip="formatPercentTooltip"/>
          <n-slider size="small" style="width: 80px" :default-value="searcher.laterDay.short" :step="1"
                    :min="2" :max="60" v-model:value="searcher.laterDay.short"
                    :format-tooltip="formatPercentTooltip"/>
          <n-dropdown size="small" trigger="hover" :options="searcher.similar.similarOptions" @select="similarSelect">
            <n-button size="small">{{ searcher.similar.label }}</n-button>
          </n-dropdown>
        </n-space>
      </n-space>
    </n-card>
    <n-card size="small" hoverable style="height: 92%">
      <k-similar-scatter-chart :k-lines="searcher.kLines" :similarity-dict="searcher.similarityDict"
                               :later-day="searcher.laterDay" :k-size="searcher.kSize"
                               style="width: 100%; height: 100%"/>
    </n-card>
  </div>
</template>

<script>
import {defineComponent, reactive, onMounted, watch} from "vue";
import StockPoolSelector from "cc/StockPoolSelector.vue";
import {func} from "./similar"
import KSimilarScatterChart from "vv/search/KSimilarScatterChart.vue";
import {svgHtmlByArr} from "@/components/svg"

export default defineComponent({
  name: "KSimilarSearch",
  components: {KSimilarScatterChart, StockPoolSelector},
  setup() {
    const searcher = reactive({
      kLines: '',
      searchCodeAlias: 'QQQ',
      kSize: 50,
      lastK: 0,
      similarityDict: {},
      laterDay: {
        long: 120,
        mid: 60,
        short: 20,
      },
      closeSvg: '',
      threshold: 0.95,
      similar: {
        similarOptions: [
          {
            label: 'SRCC-斯皮尔曼等级相关系数（结构优先）',
            key: func.findSimilarSegmentsSpearmanRankStructureFirst,
          }, {
            label: 'PCC-皮尔逊相关系数（结构优先）',
            key: func.findSimilarSegmentsPCCStructureFirst,
          }, {
            label: '欧几里得（结构优先）',
            key: func.findSimilarSegmentsEuclideanStructureFirst,
          }, {
            label: 'DTW-动态时间规整（结构优先）',
            key: func.findSimilarSegmentsDTWStructureFirst,
          }, {
            label: '余弦相似度（结构优先）',
            key: func.findSimilarSegmentsCosineStructureFirst,
          }, {
            label: '曼哈顿距离（结构优先）',
            key: func.findSimilarSegmentsManhattanStructureFirst,
          }, {
            label: '欧几里得（细节优先）',
            key: func.findSimilarSegmentsEuclidDetailsFirst,
          }, {
            label: 'DTW-动态时间规整（细节优先）',
            key: func.findSimilarSegmentsDTWDetailsFirst,
          }
        ],
        func: func.findSimilarSegmentsSpearmanRankStructureFirst,
        label: 'SRCC-斯皮尔曼等级相关系数（结构优先）',
      }
    })

    function update() {
      let searchCodeAliasKLines = searcher.kLines[searcher.searchCodeAlias].slice(-searcher.kSize - searcher.lastK)
      searchCodeAliasKLines = searchCodeAliasKLines.splice(-searcher.lastK)
      const inputArr = searchCodeAliasKLines.map((item) => [item['open'], item['high'], item['low'], item['close']])
      const codeSimilarityDict = {}

      for (const code in searcher.kLines) {
        const arr = searcher.kLines[code].map((item) => [item['open'], item['high'], item['low'], item['close']])
        const similarityDict = searcher.similar.func(inputArr, arr, searcher.threshold)
        if (Object.keys(similarityDict).length > 0) {
          codeSimilarityDict[code] = similarityDict
        }
      }
      searcher.similarityDict = codeSimilarityDict
      searcher.closeSvg = svgHtmlByArr(inputArr.map((arr) => arr[3]), 90, 20, 'black', 0.6)
    }


    function similarSelect(key) {
      searcher.similar.func = key
      searcher.similar.label = searcher.similar.similarOptions.find((obj => obj.key === key)).label
      update()
    }

    onMounted(() => {
      if (Object.keys(searcher.kLines).length > 0) {
        update()
      }
    })

    watch(() => searcher.threshold, () => {
      if (Object.keys(searcher.kLines).length > 0) {
        update()
      }
    })

    return {
      similarSelect,
      formatPercentTooltip: (value) => `${value}日`,
      searcher,
      update,
    }
  }
})
</script>

<style scoped>

</style>