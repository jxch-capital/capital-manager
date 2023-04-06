<template>
    <div class="card-con">
        <n-card size="small">
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
                <n-input-number size="small" v-model:value="condition.last" clearable placeholder="last" style="width: 110px"/>
                <n-button size="small" @click="update()" :loading="condition.loading">确定</n-button>
            </n-space>
        </n-card>

        <div v-masonry fit-width="true" transition-duration="1s" item-selector=".card" origin-left="false">
            <div v-masonry-tile v-for="(val) in sectors" :key="val['name']" class="card">
                <n-card  size="small" :title="val['name']" hoverable >
                    <TableCharts size="small" :sector="val" :rel="true"/>
                </n-card>
            </div>
        </div>

    </div>
</template>

<script>
import TableCharts from "vv/sectors/TableCharts.vue";
import {onBeforeMount, reactive, getCurrentInstance, onUpdated } from "vue";
import {apis} from "@/api";
import dayjs from "dayjs";

export default {
    name: "SectorsUS",
    components: {TableCharts},
    setup() {
        const instance = getCurrentInstance();
        const _this = instance.appContext.config.globalProperties;
        const template = "YYYY-MM-DD"
        const condition = reactive({
            last: 3,
            cycle: 'month',
            loading: false
        })
        const sectors = reactive({
            blue: {
                name: "蓝筹股",
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["SPY.US", "BRK-B.US", "BA.US"],
                res: null
            },
            industry: {
                name: "行业板块",
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["SPY.US", "XLI.US", "XLE.US", "XLY.US", "XLP.US", "XLF.US", "XLV.US", "XLC.US", "XLB.US", "XLRE.US", "XLK.US", "XLU.US"],
                res: null
            },
            it: {
                name: "IT板块",
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["QQQ.US", "GOOGL.US", "AAPL.US", "MSFT.US", "TSLA.US", "AMZN.US", "AMD.US", "TSM.US", "NVDA.US", "META.US"],
                res: null
            },
        })

        function update() {
            condition.loading = true
            new Promise((resolve,reject)=> {
                let num = 0
                for (const key in sectors) {
                    num = num + 1
                    apis.capital_service_apis.query_k_json({
                        "service_code": sectors[key]['service_code'],
                        "codes": sectors[key]['codes'],
                        "start": dayjs(new Date()).subtract(condition.last, condition.cycle).format(template),
                        "end": dayjs(new Date()).format(template)
                    }).then(res => {
                        sectors[key]['res'] = JSON.parse(JSON.stringify(res['data']).replaceAll('US', ''))
                        num = num - 1
                        if (num === 0) {
                            resolve('end')
                        }
                    })
                }
            }).then(()=> {
                condition.loading = false
                _this.$redrawVueMasonry();
            })
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
.card-con {
    width: 100%;
}
.card {
    width: 100%;
    max-width: 400px;
}
</style>