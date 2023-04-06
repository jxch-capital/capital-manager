<template>
    <div>
        <n-card size="small">
            <n-space :vertical="false" size="small" justify="space-between">
                <n-space>
                    <n-radio-group size="small" v-model:value="condition.cycle">
                        <n-radio-button size="small" value="day" checked>
                            D
                        </n-radio-button>
                        <n-radio-button size="small" value="month" checked>
                            M
                        </n-radio-button>
                        <n-radio-button size="small" value="year" checked>
                            Y
                        </n-radio-button>
                    </n-radio-group>
                    <n-input-number size="small" v-model:value="condition.last" clearable placeholder="last"
                                    style="width: 110px"/>
                    <n-button size="small" @click="update()" :loading="condition.loading">确定</n-button>
                </n-space>
                <n-space>
                    <p>
                        趋势惯性运行的长度可能远超你账户的承受能力，所以这个图是用来寻找顺势入场点的，而非逆势</p>
                </n-space>
            </n-space>
        </n-card>

        <n-space size="small">
            <n-table size="small" :bordered="false" :single-line="true" :single-column="true" :bottom-bordered="false"
                     style="max-width: 400px; text-align: center">
                <thead>
                <tr>
                    <th>时间</th>
                    <th style="background: gainsboro; font-weight:bold">总分</th>
                    <th v-if="'alias' in scores" v-for="(val, key) in scores.table">{{ scores.alias[key] }}</th>
                    <th v-else v-for="(val, key) in scores.table">{{ key }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(val, inx) in scores.data_arr">
                    <td style="background: gainsboro">{{ date_format(val[0]['date']) }}</td>
                    <td :style="{background: td_background(scores.sum_arr[inx])}">{{ scores.sum_arr[inx] }}</td>
                    <td :style="{background: td_background(parseInt(s['value']))}" v-for="(s) in val">{{
                        s['value']
                        }}
                    </td>
                </tr>
                </tbody>
            </n-table>
            <n-space :vertical="true">
                <CompareLine size="small" title="SPY" sub-title=""
                             :date-arr="scores.date_arr_re"
                             :score-arr="scores.sum_arr_re"
                             :sectorClose="scores.spy"/>
            </n-space>
        </n-space>
    </div>
</template>

<script>
import {defineComponent, onBeforeMount, reactive} from 'vue'
import chroma from 'chroma-js'
import {apis} from "@/api";
import dayjs from "dayjs";
import CompareLine from "vv/breaths/CompareLine.vue";

export default defineComponent({
    name: "Breaths",
    components: {CompareLine},
    setup() {
        const template = "YYYY-MM-DD"
        const condition = reactive({
            last: 6,
            cycle: 'month',
            loading: false
        })
        const scores = reactive({
            table: null,
            data_arr: [],
            sum_arr: [],
            date_arr: [],
            sum_arr_re: [],
            date_arr_re: [],
            alias: {
                'CND': '可选',
                'CNS': '消费',
                'COM': '通讯',
                'ENE': '能源',
                'FIN': '金融',
                'HLT': '医疗',
                'IND': '工业',
                'MAT': '材料',
                'REI': '房地',
                'TEC': '信息',
                'UTL': '公用',
            },
            spy: null
        })

        function date_format(timestamp) {
            return dayjs(new Date(timestamp)).format('YY/MM/DD')
        }

        function update() {
            condition.loading = true
            apis.capital_service_apis.query_breath_json({
                "service_code": 'tl',
                "start": dayjs(new Date()).subtract(condition.last, condition.cycle).format(template),
                "end": dayjs(new Date()).format(template)
            }).then((res) => {
                scores.table = res['data']

                const keys = Object.keys(res['data'])
                const lth = res['data'][Object.keys(res['data'])[0]].length

                for (let i = 0; i < lth; i++) {
                    const arr = []
                    let sum = 0

                    for (const inx in keys) {
                        const item = res['data'][keys[inx]][i]
                        arr.push(item)
                        sum = sum + parseInt(item['value'])
                    }

                    scores.data_arr.push(arr)
                    scores.date_arr.push(date_format(res['data'][keys[0]][i]['date']))
                    scores.sum_arr.push((sum / keys.length).toFixed(1))
                    scores.sum_arr_re = scores.sum_arr.slice().reverse()
                    scores.date_arr_re = scores.date_arr.slice().reverse()
                }

                condition.loading = false
            })

            apis.capital_service_apis.query_k_json({
                "service_code": "pdr-stooq",
                "codes": ["SPY.US"],
                "start": dayjs(new Date()).subtract(condition.last, condition.cycle).format(template),
                "end": dayjs(new Date()).format(template)
            }).then(res => {
                scores.spy = (res['data']['SPYUS']).map(item => item['close'])
                console.log(scores.spy)
            })
        }


        const chroma_scale_green = chroma.scale(['#F0FA18', '#18FA26'])
        const chroma_scale_red = chroma.scale(['#FF6546', '#F0FA18'])

        function td_background(val) {
            if (val >= 50) {
                return chroma_scale_green((val - 50) / 50).hex()
            } else {
                return chroma_scale_red(val / 50).hex()
            }
        }

        onBeforeMount(() => update())

        return {
            scores,
            condition,
            date_format,
            td_background,
            update
        }
    }
})
</script>

<style scoped>

</style>