<template>
    <div style="height: 100%;">
        <n-card size="small" hoverable style="height: 88%">
            <k-line :name="k_data.name" :data-arr="k_data.data_arr"
                    :data-zoom="100 - Math.floor(100 * k_data.k_number / k_data.index)"/>
        </n-card>
        <n-card>
            <n-space justify="start" size="small">
                <n-form
                    ref="formRef"
                    :model="params"
                    label-placement="left"
                    label-width="auto"
                    require-mark-placement="right-hanging"
                    size="small"
                    inline
                >
                    <n-form-item label="interval" path="inputValue" label-placement="left" size="small">
                        <n-input v-model:value="params.interval" placeholder="interval" style="width: 100px"/>
                    </n-form-item>
                    <n-form-item label="service" path="inputValue" label-placement="left" size="small">
                        <n-input v-model:value="params.service_code" placeholder="service_code" style="width: 100px"/>
                    </n-form-item>
                    <n-form-item label="code" path="inputValue" label-placement="left" size="small">
                        <n-input v-model:value="params.code" placeholder="code" style="width: 100px"/>
                    </n-form-item>
                    <n-form-item label="start" path="inputValue" label-placement="left" size="small">
                        <n-input v-model:value="params.start" placeholder="start"/>
                    </n-form-item>
                    <n-form-item label="end" path="inputValue" label-placement="left" size="small">
                        <n-input v-model:value="params.end" placeholder="end"/>
                    </n-form-item>
                    <n-form-item label="back" path="inputValue" label-placement="left" size="small">
                        <n-input v-model:value="params.back" placeholder="back"/>
                    </n-form-item>
                    <n-button size="small" @click="start_back" :loading="params.loading">开始回放</n-button>
                    <n-divider vertical/>
                    <n-form-item label="K线数量" path="inputValue" label-placement="left" size="small">
                        <n-input v-model:value="k_data.k_number" placeholder="k_number"/>
                    </n-form-item>
                    <n-divider vertical/>
                    <n-button size="small" @click="next" :loading="k_data.loading">Next &rarr;</n-button>
                </n-form>
            </n-space>
        </n-card>
    </div>
</template>

<script>
import {defineComponent, onBeforeMount, reactive, getCurrentInstance, onUpdated} from "vue";
import {apis} from "@/api";
import dayjs from "dayjs";
import KLine from "vv/back/KLine.vue";
import {useMessage} from 'naive-ui'

export default defineComponent({
    name: "KBackM",
    components: {KLine},

    setup() {
        const message = useMessage()
        const template = "YYYY-MM-DD\nHH:mm"
        const template_show = "YYYY-MM-DD HH:mm:SS"
        const template_params = "YYYY-MM-DD"

        const params = reactive({
            service_code: 'yf',
            code: 'SPY',
            start: dayjs(new Date()).subtract(10, 'day').format(template_params),
            end: dayjs(new Date()).format(template_params),
            back: dayjs(new Date()).subtract(5, 'day').format(template_params),
            interval: '5m',
            loading: false,
        })

        let k_data = reactive({
            name: params.code,
            all_data_arr: [],
            index: 0,
            data_arr: [],
            k_length: 0,
            k_number: 150,
            loading: false,
            start_time: '21:30',
            split_time: [],
        })

        function start_back() {
            params.loading = true

            if (params.back < params.start || params.back > params.end) {
                message.warning("回放时间应该在开始时间和结束时间中间")
                params.loading = false
                return;
            }

            apis.capital_service_apis.query_k_json({
                "service_code": params.service_code,
                "codes": [params.code],
                "start": params.start,
                "end": params.end,
                "interval": params.interval,
            }).then(res => {

                if (JSON.stringify(res.data) === '{}') {
                    message.error("服务器无返回，可能是参数错误")
                    params.loading = false
                    return;
                } else if (res.data['code'] === -1) {
                    message.error(res.data['msg'])
                    params.loading = false
                    return;
                }

                const dataset = res.data[params.code].map(item => [
                    dayjs(item['date']).format(template),
                    item['open'].toFixed(2),
                    item['high'].toFixed(2),
                    item['low'].toFixed(2),
                    item['close'].toFixed(2),
                    item['volume'].toFixed(2),
                    item['close'] > item['open'] ? 1 : item['close'] < item['open'] ? -1 : 0,
                    item['close_20_ema'].toFixed(2),
                ])


                const back_tmp = dayjs(params.back).set('hour', dayjs(dataset[0][0]).hour()).format(template)
                params.back = dayjs(back_tmp).set('minute', dayjs(dataset[0][0]).minute()).format(template)

                k_data.index = dataset.findIndex(item => item[0] === params.back)
                while (k_data.index === -1 || params.back > params.end) {
                    params.back = dayjs(params.back).subtract(1, 'day').format(template)
                    k_data.index = dataset.findIndex(item => item[0] === params.back)
                }

                k_data.k_length = dataset.length
                k_data.name = params.code
                k_data.all_data_arr = dataset
                k_data.data_arr = dataset.slice(0, k_data.index)

                k_data.start_time = dayjs(dataset[0][0]).hour().toString().padStart(2,'0') + ':'
                    + dayjs(dataset[0][0]).minute().toString().padStart(2,'0')
                k_data.split_time = dataset.filter(item => item[0].includes(k_data.start_time)).map(item => [
                    item[0], item[2]
                ])

                params.loading = false
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
            k_data.loading = false
        }

        document.addEventListener("keyup", function (e) {
            if (e.key === "ArrowRight") {
                next()
            }
        })

        start_back()

        return {
            params,
            k_data,
            start_back,
        }
    }
})
</script>

<style scoped>

</style>