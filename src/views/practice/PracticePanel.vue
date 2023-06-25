<template>
  <n-space size="small" style="width: 100%; height: 100%">
    <n-space size="small" vertical>
      <n-form-item size="small" label="当前市场处于什么趋势状态？" required>
        <n-space size="small" vertical>
          <n-space size="small">
            <n-checkbox size="small" value="bull" label="多头"/>
            <n-checkbox size="small" value="bear" label="空头"/>
            <n-checkbox size="small" value="area" label="区间"/>
            <n-checkbox size="small" value="breakout" label="突破"/>
          </n-space>
          <n-input size="small" placeholder="准确描述一下"/>
        </n-space>
      </n-form-item>
      <n-form-item size="small" label="你觉得当前图表中有哪些值得关注的价格行为？" required>
        <n-input size="small" type="textarea"/>
      </n-form-item>
      <n-form-item size="small" label="你觉得后续市场倾向延续哪些价格行为？" required>
        <n-input size="small" type="textarea"/>
      </n-form-item>
      <n-form-item size="small" label="你发现了哪些交易机会？会怎样制定交易计划？" required>
        <n-input size="small" type="textarea"/>
      </n-form-item>
      <n-form-item size="small" label="后续市场行为中有哪些符合你的预期？" required>
        <n-space size="small" vertical>
          <n-space size="small">
            <n-checkbox size="small" value="bull" label="市场状态"/>
            <n-checkbox size="small" value="area" label="价格行为"/>
            <n-checkbox size="small" value="bear" label="交易计划"/>
          </n-space>
          <n-input size="small" type="textarea" placeholder="有哪些经验教训"/>
        </n-space>
      </n-form-item>
      <n-space size="small">
        <n-button size="small">提交 ⬆</n-button>
        <n-form-item size="small" label="给自己的判断打个分" label-placement="left" required>
          <n-input size="small" style="width: 60px" placeholder="0-100"/>
        </n-form-item>
      </n-space>
    </n-space>
    <practice-k-line-chart :data-arr="condition.dataArr"
                           :data-zoom-start="condition.dataZoomStart"
                           :data-zoom-end="condition.dataZoomEnd"
                           :end-x="condition.endX"
                           style="width: 1100px"/>
  </n-space>
</template>

<script>
import {defineComponent, reactive, watch, toRaw} from "vue";
import PracticeKLineChart from "vv/practice/PracticeKLineChart.vue";
import dayjs from "dayjs";
import {EMA} from "technicalindicators"

export default defineComponent({
  name: "PracticePanel",
  components: {PracticeKLineChart},
  props: {
    kLine: Object,
    show: Boolean,
    showKNum: Number,
  },
  setup(props) {
    const template = "YYYY-MM-DD"
    const condition = reactive({
      dataArr: [],
      dataZoomStart: 90,
      dataZoomEnd: 100,
      endX: '',
    })

    function update(newData) {
      const kDataArr = toRaw(newData)
      const endIndex = toRaw(props.kLine.endIndex)
      const kData = props.show ? kDataArr : kDataArr.slice(0, endIndex)

      let period = 20;
      let values = kData.map(item => item.close);
      let emaArr = new Array(period - 1).fill(0).concat(EMA.calculate({period: period, values: values}));

      condition.dataArr = kData.map((item, index) => [
        dayjs(item['date']).format(template),
        item['open'].toFixed(2),
        item['high'].toFixed(2),
        item['low'].toFixed(2),
        item['close'].toFixed(2),
        item['volume'].toFixed(2),
        item['close'] > item['open'] ? 1 : item['close'] < item['open'] ? -1 : 0,
        emaArr[index].toFixed(2),
      ])
    }

    watch(() => props.kLine.endIndex, (newData) => {
      condition.endX = dayjs(props.kLine.data[newData]['date']).format(template)
    })

    watch(() => props.kLine.data, (newData) => {
      update(newData)
      const endIndex = toRaw(props.kLine.endIndex)
      const kNum = toRaw(props.showKNum)

      condition.dataZoomStart = (endIndex - kNum) / endIndex * 100
      condition.dataZoomEnd = 100
    })

    watch(() => props.show, (newData) => {
      update(props.kLine.data)
      const endIndex = toRaw(props.kLine.endIndex)
      const dataArr = toRaw(props.kLine.data)
      const len = dataArr.length
      const kNum = toRaw(props.showKNum)

      if (toRaw(props.show)) {
        condition.dataZoomStart = (endIndex - kNum) / len * 100
        condition.dataZoomEnd = (endIndex + kNum) / len * 100
      } else {
        condition.dataZoomStart = (endIndex - kNum) / endIndex * 100
        condition.dataZoomEnd = 100
      }
    })

    return {
      condition
    }
  }
})

</script>

<style scoped>

</style>