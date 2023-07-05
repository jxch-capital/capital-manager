<template>
  <div style="height: 100%;">
    <n-card size="small" hoverable style="height: 8%">
      <n-space justify="space-between" size="small">
        <n-space size="small">
          <n-date-picker size="small" v-model:value="params.range" type="daterange" clearable style="width: 260px"/>
          <n-date-picker size="small" v-model:value="params.back" type="date" clearable style="width: 120px"/>
          <n-input size="small" v-model:value="params.code" placeholder="code" style="width: 60px"/>
          <n-button size="small" @click="start_back" :loading="params.loading">开始回放</n-button>
        </n-space>
        <n-space size="small">
          <n-input size="small" v-model:value="k_data.k_number" placeholder="k_number" style="width: 60px"/>
          <n-button size="small" @click="next" :loading="k_data.loading">Next &rarr;</n-button>
        </n-space>
      </n-space>
    </n-card>
    <n-card size="small" hoverable style="height: 92%">
      <k-line :name="k_data.name" :data-arr="k_data.data_arr"
              :data-zoom="100 - Math.floor(100 * k_data.k_number / k_data.index)"
              :split-time="k_data.split_time"/>
    </n-card>
  </div>
</template>

<script>
import {defineComponent, onBeforeMount, reactive, getCurrentInstance, toRaw} from "vue";
import {apis} from "@/api";
import dayjs from "dayjs";
import KLine from "vv/back/KLine.vue";
import {useMessage, useNotification} from 'naive-ui'
import {EMA} from "technicalindicators";

export default defineComponent({
  name: "KBackD",
  components: {KLine},

  setup() {
    const message = useMessage()
    const template = "YYYY-MM-DD"
    const notification = useNotification()

    const params = reactive({
      service_code: 'yf',
      code: 'SPY',
      back: dayjs(Date.now()).subtract(3, 'month').valueOf(),
      interval: '1d',
      loading: false,
      range: [dayjs("2010-01-01", template).valueOf(), Date.now()],
    })

    let k_data = reactive({
      name: params.code,
      all_data_arr: [],
      index: 0,
      data_arr: [],
      k_length: 0,
      k_number: 150,
      loading: false,
      split_time: [],
    })

    function start_back() {
      params.loading = true

      if (params.back < params.range[0] || params.back > params.range[1]) {
        message.warning("回放日期应该在开始日期和结束日期中间")
        params.loading = false
        return;
      }

      apis.capital_service_apis.query_k_json({
        "service_code": params.service_code,
        "codes": [params.code],
        "start": dayjs(params.range[0]).format(template),
        "end": dayjs(params.range[1]).format(template),
        "interval": params.interval,
      }).then(res => {

        if (res.data && res.data.code && res.data.code === -1) {
          message.error("服务器内部错误，可能是参数错误：" + res['data']['msg'])
          params.loading = false
          console.log(res)
          return;
        }

        const kData = res.data[params.code]
        let period = 20;
        let values = kData.map(item => item.close);
        let emaArr = new Array(period - 1).fill(0).concat(EMA.calculate({period: period, values: values}));

        const dataset = kData.map((item, index) => [
          dayjs(item['date']).format(template),
          item['open'].toFixed(2),
          item['high'].toFixed(2),
          item['low'].toFixed(2),
          item['close'].toFixed(2),
          item['volume'].toFixed(2),
          item['close'] > item['open'] ? 1 : item['close'] < item['open'] ? -1 : 0,
          emaArr[index].toFixed(2),
        ])

        k_data.index = dataset.findIndex(item => item[0] === params.back)

        while (k_data.index === -1 || params.back > params.range[1]) {
          params.back = dayjs(params.back).subtract(1, 'day').valueOf()
          k_data.index = dataset.findIndex(item => item[0] === dayjs(params.back).format(template))
        }

        k_data.k_length = dataset.length
        k_data.name = params.code
        k_data.all_data_arr = dataset
        k_data.data_arr = dataset.slice(0, k_data.index)
        params.loading = false

        k_data.split_time = [[
          dayjs(params.back).format(template), dataset[k_data.index][2]
        ]]
      })
    }

    function next() {
      k_data.loading = true
      k_data.index = k_data.index + 1
      if (k_data.index === k_data.k_length) {
        message.success('回放结束')
      } else {
        k_data.data_arr = k_data.all_data_arr.slice(0, k_data.index)
      }

      const histKs = k_data.data_arr.map(item => ({
        "date": dayjs(item[0], template).valueOf(),
        "open": item[1],
        "high": item[2],
        "low": item[3],
        "close": item[4],
        "volume": item[5],
      }))

      apis.capital_pa_apis.pa_analyze_default({
        "histKs": histKs
      }).then(res => {
        if (res.data.body) {
          let msg = ""
          for (const index in res.data.body) {
            const item = res.data.body[index]
            msg += "形态：" + item['title'] + "-" + item['summary'] + "\n"
            msg += "   信息：" + item['detailed'] + "\n"
            msg += "============================\n"
          }

          if (msg !== "") {
            notification.create({
              title: k_data.data_arr[k_data.data_arr.length - 1][0],
              content: msg,
              duration: 1000 * 60 * 5
            })
          }
        }
      }).finally(() => {
        k_data.loading = false
      })
    }

    document.addEventListener("keyup", function (e) {
      if (e.key === "ArrowRight") {
        next()
      }
      if (e.key === "Escape"){
        notification.destroyAll()
      }
    })

    start_back()

    return {
      params,
      k_data,
      start_back,
      next,
    }
  }
})

</script>

<style scoped>

</style>