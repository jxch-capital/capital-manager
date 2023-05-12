<template>
    <div style="height: 100%">
        <n-card size="small" hoverable>
            <n-space :vertical="false" size="small">
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
                <n-dropdown size="small" trigger="hover" :options="compareOptionsComputed"
                            @select="handleCompareSelect">
                    <n-button size="small" :loading="condition.loading" @click="update">
                        {{ compareOptions[lineData.compareFunc]['label'] }}
                    </n-button>
                </n-dropdown>
                <n-dropdown size="small" trigger="hover" :options="optionsComputed" @select="handleSelect">
                    <n-button size="small" :loading="condition.loading" @click="update">
                        {{ sectors[lineData.title]['name'] }}
                    </n-button>
                </n-dropdown>
            </n-space>
        </n-card>
        <n-card size="small" hoverable style="height: 90%">
            <Line :title="sectors[lineData.title]['name']" :data-label="lineData.dataLabel"
                  :show-label="lineData.showLabel" :sorted="true"
                  :data="lineData.data" :compare-func="lineData.compareFunc"/>
        </n-card>
    </div>
</template>

<script>

import {defineComponent, reactive, toRaw, computed} from "vue";
import Line from "vv/compare/Line.vue";
import {apis} from "@/api";
import dayjs from "dayjs";

export default defineComponent({
    name: "Compare",
    components: {Line},

    setup() {
        const template = "YYYY-MM-DD"
        const condition = reactive({
            last: 3,
            cycle: 'month',
            loading: false,
        })

        function stooqFormatter(data, sector) {
            const newData = []
            for (const key in data) {
                newData[key.slice(0, -2)] = data[key]
            }
            return newData
        }

        function yfFormatter(data, sector) {
            const newData = []
            for (const key in data) {
                newData[key.slice(0, -2)] = data[key]
            }
            return newData
        }

        function aliasStooqFormatter(data, sector) {
            data = stooqFormatter(data, sector)
            const newData = {}
            for (const key in data) {
                newData[sector['alias'][sector['codes'].findIndex(item => item.replace('.US', '') === key)]] = data[key]
            }
            return newData
        }

        function aliasYfFormatter(data, sector) {
            data = yfFormatter(data, sector)
            const newData = {}
            for (const key in data) {
                newData[sector['alias'][sector['codes'].findIndex(item =>
                    item.replace('.SS', '').replace('.SZ', '') === key)]] = data[key]
            }
            return newData
        }

        const sectors = reactive({
            it: {
                name: "IT【美】",
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["QQQ.US", "GOOGL.US", "AAPL.US", "MSFT.US", "TSLA.US", "AMZN.US", "AMD.US", "TSM.US", "NVDA.US", "META.US"],
                formatter: stooqFormatter
            },
            industry: {
                name: "行业板块【美】",
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["SPY.US", "XLI.US", "XLE.US", "XLY.US", "XLP.US", "XLF.US", "XLV.US", "XLC.US", "XLB.US", "XLRE.US", "XLK.US", "XLU.US"],
                alias: ["SPY", "工业", "能源", "消费", "必消", "金融", "医疗", "通讯", "材料", "房地", "科技", "公用"],
                formatter: aliasStooqFormatter
            },
            industry_c: {
                name: "行业板块【中-上证】",
                frequency: "d",
                service_code: 'yf',
                codes: ["000001.SS", "000032.SZ", "000034.SZ", "000035.SZ", "000036.SZ", "000037.SZ", "000038.SZ", "000039.SZ", "000040.SZ",
                    "000042.SZ"],
                alias: ["上证", "能源", "工业", "可选", "消费", "医药", "金融", "信息", "电信", "央企"],
                formatter: aliasYfFormatter
            },
            blue_c: {
                name: "蓝筹【中】",
                frequency: "d",
                service_code: 'yf',
                codes: ["000001.SS", "600519.SS", "600600.SS", "601318.SS", "600887.SS", "603288.SS", "000538.SZ", "000333.SZ", "002594.SZ",
                    "601607.SS", "000002.SZ"],
                alias: ["上证指数", "贵州茅台", "青岛啤酒", "中国平安", "伊利股份", "海天味业", "云南白药", "美的集团", "比亚迪", "上海医药", "万科A"],
                formatter: aliasYfFormatter
            },
            china: {
                name: "IT【中概】",
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["QQQ.US", "BABA.US", "BIDU.US", "JD.US", "PDD.US", "NTES.US", "WB.US", "BILI.US", "TCOM.US"],
                alias: ["QQQ", "BABA", "BIDU", "JD", "PDD", "网易", "WB", "BILI", "携程"],
                formatter: aliasStooqFormatter
            },
        })

        const compareOptions = reactive({
            'pre-com': {
                label: '百分比',
                key: 'pre-com',
            }
        })

        const lineData = reactive({
            data: {},
            dataLabel: 'Date',
            showLabel: 'close',
            title: 'it',
            compareFunc: 'pre-com',
        })

        const optionsComputed = computed(() => {
            const rawSectors = toRaw(sectors)
            return Object.keys(rawSectors).map(item => {
                return {label: rawSectors[item]['name'], key: item}
            })
        })
        const compareOptionsComputed = computed(() => {
            const rawCompareOptions = toRaw(compareOptions)
            return Object.keys(rawCompareOptions).map(item => {
                return {label: rawCompareOptions[item]['label'], key: item}
            })
        })

        function query(sector) {
            condition.loading = true
            apis.capital_service_apis.query_k_json({
                "service_code": sector['service_code'],
                "codes": sector['codes'],
                "start": dayjs(new Date()).subtract(condition.last, condition.cycle).format(template),
                "end": dayjs(new Date()).format(template)
            }).then(res => {
                if (sector.formatter) {
                    lineData.data = sector.formatter(res.data, sector)
                } else {
                    lineData.data = res.data
                }
                condition.loading = false
            })
        }

        function handleSelect(key) {
            lineData.title = key
            query(sectors[key])
        }

        function handleCompareSelect(key) {
            lineData.compareFunc = key
            query(sectors[lineData.title])
        }

        function update() {
            query(sectors[lineData.title])
        }

        update()
        return {
            condition,
            sectors,
            lineData,
            optionsComputed,
            compareOptions,
            compareOptionsComputed,
            handleSelect,
            handleCompareSelect,
            update,
        }
    }
})
</script>

<style scoped>


</style>