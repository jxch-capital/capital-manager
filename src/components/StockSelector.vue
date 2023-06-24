<template>
  <n-space size="small">
    <date-selector :condition="condition"/>
    <n-input size="small" v-model:value="condition.code" placeholder="Code" style="width: 80px"/>
    <n-button size="small" :loading="condition.loading" @click="update">Go</n-button>
  </n-space>
</template>

<script>

import {defineComponent, reactive} from "vue";
import DateSelector from "cc/DateSelector.vue";
import {useMessage} from "naive-ui";
import {apis} from "@/api";
import dayjs from "dayjs";

export default defineComponent({
  name: "StockSelector",
  components: {DateSelector},
  props: {
    kLine: Object,
  },
  emits: ['update:kLine'],
  setup(props, {emit}) {
    const message = useMessage()
    const template = "YYYY-MM-DD"
    const condition = reactive({
      last: 2,
      cycle: 'year',
      code: 'QQQ',
      service_code: 'yf',
      loading: false,
      kLine: [],
    })

    function update() {
      condition.loading = true
      apis.capital_service_apis.query_k_json({
        "service_code": condition.service_code,
        "codes": [condition.code],
        "start": dayjs(new Date()).subtract(condition.last, condition.cycle).format(template),
        "end": dayjs(new Date()).format(template)
      }).then(res => {
        condition.kLine = res['data']
        emit('update:kLine', condition.kLine)
      }).catch(e => {
        console.log(e)
        message.error(`查询报错：${e['massage']}`)
      }).finally(() => {
        condition.loading = false
      })
    }

    update()
    return {
      update,
      condition,
    }
  }
})
</script>

<style scoped>

</style>