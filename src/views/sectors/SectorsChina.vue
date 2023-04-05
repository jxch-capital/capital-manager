<template>
    <n-space size="small">
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
import {defineComponent, onBeforeMount, reactive} from 'vue'
import TableCharts from "vv/sectors/TableCharts.vue";
import {apis} from "@/api"
import dayjs from "dayjs";

export default defineComponent({
    name: "SectorsChina",
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
                name: "行业板块",
                frequency: "d",
                service_code: 'bs',
                codes: ["sh.000090", "sh.000933", "sz.399997", "sh.000932", "sz.399808", "sz.399928", "sh.000934", "sz.399935",
                    "sh.000134", "sh.000038"],
                res: null
            },
            blue: {
                name: "蓝筹股",
                frequency: "d",
                service_code: 'bs',
                codes: ["sh.000090", "sh.600519", "sh.600600", "sh.601318", "sh.600887", "sh.603288", "sz.000538", "sz.000333", "sz.002594",
                    "sh.601607", "sz.000002"],
                res: null
            },
            china: {
                name: "中概股",
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["QQQ.US", "BABA.US", "BIDU.US", "JD.US", "PDD.US", "NTES.US", "WB.US", "BILI.US", "TCOM.US"],
                res: null
            }
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
})

</script>

<style scoped>

</style>