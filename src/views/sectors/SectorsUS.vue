<template>
    <n-space>
        <n-card title="条件">
            <n-space :vertical="true" size="small">
                <n-radio-group v-model:value="condition.cycle">
                    <n-radio-button value="day" checked>
                        D
                    </n-radio-button>
                    <n-radio-button value="month" checked>
                        M
                    </n-radio-button>
                    <n-radio-button value="year" checked>
                        Y
                    </n-radio-button>
                </n-radio-group>
                <n-input-number v-model:value="condition.last" clearable placeholder="last" style="width: 110px"/>
                <n-divider/>
                <n-button @click="update()" :loading="condition.loading">确定</n-button>
            </n-space>
        </n-card>
        <n-card v-for="(val) in sectors" :title="val['name']" hoverable>
            <TableCharts :sector="val" :rel="true"/>
        </n-card>
    </n-space>
</template>

<script>
import TableCharts from "vv/sectors/TableCharts.vue";
import {onBeforeMount, reactive} from "vue";
import {apis} from "@/api";
import dayjs from "dayjs";

export default {
    name: "SectorsUS",
    components: {TableCharts},
    setup() {
        const template = "YYYY-MM-DD"
        const condition = reactive({
            last: 3,
            cycle: 'month',
            loading: false
        })
        const sectors = reactive({
            industry: {
                name: "行业板块-3M",
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["SPY.US", "XLI.US", "XLE.US", "XLY.US", "XLP.US", "XLF.US", "XLV.US", "XLC.US", "XLB.US", "XLRE.US", "XLK.US", "XLU.US"],
                res: null
            },
            it: {
                name: "IT板块-3M",
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["QQQ.US", "GOOOGL.US", "AAPL.US", "MSFT.US", "TSLA.US", "AMZN.US", "AMD.US", "TSM.US", "NVDA.US", "META.US"],
                res: null
            },
        })

        function update() {
            condition.loading = true
            for (const key in sectors) {
                apis.capital_service_apis.query_k_json({
                    "service_code": sectors[key]['service_code'],
                    "codes": sectors[key]['codes'],
                    "start": dayjs(new Date()).subtract(condition.last, condition.cycle).format(template),
                    "end": dayjs(new Date()).format(template)
                }).then(res => {
                    sectors[key]['res'] = JSON.parse(JSON.stringify(res['data']).replaceAll('US', ''))
                    condition.loading = false
                })
            }
        }

        onBeforeMount(() => update())

        return {
            sectors,
            condition,
            update
        }
    }
}
</script>

<style scoped>

</style>