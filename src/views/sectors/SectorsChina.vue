<template>
    <n-space>
        <n-card :title="sectors.industry['name']" hoverable>
            <TableCharts :sector="sectors.industry"/>
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
        const sectors = reactive({
            industry: {
                name: "行业板块-3M",
                frequency: "d",
                service_code: 'bs',
                codes: ["sh.000090", "sh.000933", "sz.399997", "sh.000932", "sz.399808", "sz.399928", "sh.000934", "sz.399935"],
                res: null
            }
        })

        onBeforeMount(() => {
            for (const key in sectors) {
                apis.capital_service_apis.query_k_json({
                    "service_code": sectors[key]['service_code'],
                    "codes": sectors[key]['codes'],
                    "start": dayjs(new Date()).subtract(3, 'month').format(template),
                    "end": dayjs(new Date()).format(template)
                }).then(res => {
                    sectors[key]['res'] = res['data']
                })
            }
        })

        return {
            sectors
        }
    }
})

</script>

<style scoped>

</style>