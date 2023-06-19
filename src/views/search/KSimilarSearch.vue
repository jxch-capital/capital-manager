<template>
  <div style="height: 100%">
    <n-card size="small" hoverable style="height: 8%">
      <n-space :vertical="false" size="small" justify="space-between">
        <n-space size="small">
          <stock-pool-selector v-model:k-lines="searcher.kLines" :auto-selector="false"/>
          <n-input-number v-model:value="searcher.kSize" size="small" style="width: 80px"/>
          <n-input size="small" style="width: 80px" v-model:value="searcher.searchCodeAlias" placeholder="Alias"/>
          <n-input size="small" style="width: 60px" v-model:value="searcher.threshold" placeholder="threshold"/>
          <n-dropdown size="small" trigger="hover" :options="searcher.similar.similarOptions" @select="similarSelect">
            <n-button size="small">GO</n-button>
          </n-dropdown>
        </n-space>
        <n-space size="small">
          <div v-html="searcher.closeSvg"></div>
          <p>LMS⬆:</p>
          | <p :style="{ color: getUpsideTextColor(searcher.upside.long) }">{{ searcher.upside.long }}%</p>
          | <p :style="{ color: getUpsideTextColor(searcher.upside.mid) }">{{ searcher.upside.mid }}%</p>
          | <p :style="{ color: getUpsideTextColor(searcher.upside.short) }">{{ searcher.upside.short }}%</p> |
          <n-slider size="small" style="width: 80px" :default-value="searcher.laterDay.long" :step="1"
                    :min="60" :max="200" v-model:value="searcher.laterDay.long"
                    :format-tooltip="formatPercentTooltip"/>
          <n-slider size="small" style="width: 80px" :default-value="searcher.laterDay.mid" :step="1"
                    :min="20" :max="100" v-model:value="searcher.laterDay.mid"
                    :format-tooltip="formatPercentTooltip"/>
          <n-slider size="small" style="width: 80px" :default-value="searcher.laterDay.short" :step="1"
                    :min="2" :max="60" v-model:value="searcher.laterDay.short"
                    :format-tooltip="formatPercentTooltip"/>
        </n-space>
      </n-space>
    </n-card>
    <n-card size="small" hoverable style="height: 92%">
      <k-similar-scatter-chart :k-lines="searcher.kLines" :similarity-dict="searcher.similarityDict"
                               v-model:upside="searcher.upside" :later-day="searcher.laterDay"
                               :k-size="searcher.kSize"/>
    </n-card>
  </div>
</template>

<script>
import {defineComponent, reactive} from "vue";
import StockPoolSelector from "cc/StockPoolSelector.vue";
import {findSimilarSegments, findSimilarSegmentsDTW} from "./similar"
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
      similarityDict: {},
      upside: {
        long: 0,
        mid: 0,
        short: 0,
      },
      laterDay: {
        long: 120,
        mid: 60,
        short: 20,
      },
      closeSvg: '',
      threshold: 0.8,
      similar: {
        similarOptions: [
          {
            label: '欧几里得',
            key: findSimilarSegments,
          },
          {
            label: 'DTW',
            key: findSimilarSegmentsDTW,
          }
        ],
        func: findSimilarSegments
      }
    })

    function update() {
      let searchCodeAliasKLines = searcher.kLines[searcher.searchCodeAlias].slice(-searcher.kSize)
      const inputArr = searchCodeAliasKLines.map((item) => [item['open'], item['high'], item['low'], item['close']])
      const codeSimilarityDict = {}

      for (const code in searcher.kLines) {
        const arr = searcher.kLines[code].map((item) => [item['open'], item['high'], item['low'], item['close']])
        const similarityDict = searcher.similar.func(inputArr, arr, searcher.threshold)
        if (Object.keys(similarityDict).length > 0) {
          codeSimilarityDict[code] = similarityDict
        }
      }
      console.log(codeSimilarityDict)
      searcher.similarityDict = codeSimilarityDict
      searcher.closeSvg = svgHtmlByArr(inputArr.map((arr) => arr[3]), 90, 20, 'black', 0.6)
    }

    function getUpsideTextColor(value) {
      if (value > 60) {
        return "green";
      } else if (value < 40) {
        return "red";
      } else {
        return "gray";
      }
    }

    function similarSelect(key) {
      searcher.similar.func = key
      update()
    }

    return {
      similarSelect,
      formatPercentTooltip: (value) => `${value}日`,
      getUpsideTextColor,
      searcher,
      update,
    }
  }
})
</script>

<style scoped>

</style>