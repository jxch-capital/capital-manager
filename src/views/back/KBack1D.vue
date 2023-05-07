<template>
    <div style="height: 100%;">
        <n-card size="small" hoverable style="height: 88%">
            <k-line :name="k_data.name" :data-arr="k_data.data_arr" :data-zoom="100 - Math.floor(100 * k_data.k_number / k_data.index)"/>
        </n-card>
        <n-card size="small" hoverable>
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
                    <n-button size="small" @click="start_back">开始回放</n-button>
                    <n-divider vertical/>
                    <n-form-item label="K线数量" path="inputValue" label-placement="left" size="small">
                        <n-input v-model:value="k_data.k_number" placeholder="k_number"/>
                    </n-form-item>
                    <n-divider vertical/>
                    <n-button size="small" @click="next">Next &rarr;</n-button>
                </n-form>
            </n-space>
        </n-card>
    </div>
</template>

<script setup lang="js">
import {defineComponent, onBeforeMount, reactive, getCurrentInstance, onUpdated} from "vue";
import {apis} from "@/api";
import dayjs from "dayjs";
import KLine from "vv/back/KLine.vue";
import {useMessage} from 'naive-ui'

export default defineComponent({
    name: "KBack1D",
    components: {KLine},

    setup() {
        const message = useMessage()
        const template = "YYYY-MM-DD"

        const params = reactive({
            service_code: 'yf',
            code: 'SPY',
            start: dayjs(new Date()).subtract(10 * 12, 'month').format(template),
            end: dayjs(new Date()).format(template),
            back: dayjs(new Date()).subtract(3 * 12, 'month').format(template),
        })

        let k_data = reactive({
            name: params.code,
            all_data_arr: [],
            index: 0,
            data_arr: [],
            k_length: 0,
            k_number: 150,
        })

        function start_back() {
            apis.capital_service_apis.query_k_json({
                "service_code": params.service_code,
                "codes": [params.code],
                "start": params.start,
                "end": params.end,
            }).then(res => {
                const dataset = res.data[params.code].map(item => [
                    dayjs(item['Date']).format(template),
                    item['open'],
                    item['high'],
                    item['low'],
                    item['close'],
                    item['volume'],
                    item['close'] > item['open'] ? 1 : item['close'] < item['open'] ? -1 : 0,
                    item['close_20_ema'],
                ])

                do {
                    k_data.index = dataset.findIndex(item => item[0] === params.back)
                    params.back = dayjs(params.back).add(1, 'day').format(template)
                } while (k_data.index === -1)

                k_data.k_length = dataset.length
                k_data.name = params.code
                k_data.all_data_arr = dataset
                k_data.data_arr = dataset.slice(0, k_data.index)
            })
        }

        function next() {
            k_data.index = k_data.index + 1
            if (k_data.index === k_data.k_length) {
                message.success('回放结束')
            } else {
                k_data.data_arr = k_data.all_data_arr.slice(0, k_data.index)
            }
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
            next,
        }
    }
})

</script>

<style scoped>

</style>