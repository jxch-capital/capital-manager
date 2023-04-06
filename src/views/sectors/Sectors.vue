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
                <n-input-number size="small" v-model:value="condition.last" clearable placeholder="last"
                                style="width: 110px"/>
                <n-button size="small" @click="update()" :loading="condition.loading">确定</n-button>
            </n-space>
        </n-card>

        <div v-masonry fit-width="true" transition-duration="1s" item-selector=".card" origin-left="false">
            <div v-masonry-tile v-for="(val) in sectors" :key="val['name']" class="card">
                <n-card size="small" :title="val['name']" hoverable>
                    <TableCharts size="small" :sector="val" :rel="val['rel']"/>
                </n-card>
            </div>
        </div>

    </div>
</template>

<script>
import TableCharts from "vv/sectors/TableCharts.vue";
import {onBeforeMount, reactive, getCurrentInstance, onUpdated} from "vue";
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
                name: "蓝筹【美】",
                rel: false,
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["SPY.US", "BRK-B.US", "BA.US"],
                alias: ["SPY", "BRK", "波音"],
                res: null
            },
            industry: {
                name: "行业板块【美】",
                rel: false,
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["SPY.US", "XLI.US", "XLE.US", "XLY.US", "XLP.US", "XLF.US", "XLV.US", "XLC.US", "XLB.US", "XLRE.US", "XLK.US", "XLU.US"],
                alias: ["SPY", "工业", "能源", "消费", "必消", "金融", "医疗", "通讯", "材料", "房地", "科技", "公用"],
                res: null
            },
            it: {
                name: "IT【美】",
                rel: false,
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["QQQ.US", "GOOGL.US", "AAPL.US", "MSFT.US", "TSLA.US", "AMZN.US", "AMD.US", "TSM.US", "NVDA.US", "META.US"],
                res: null
            },
            foreign: {
                name: "汇率 USD/",
                rel: false,
                frequency: "d",
                service_code: 'yf',
                codes: ["USDCNY=X", "USDJPY=X", "USDGBP=X", "USDEUR=X", "USDKRW=X"],
                alias: ["CNY", "JPY", "GBP", "EUR", "KRW"],
                res: null
            },
            futures: {
                name: "期货",
                rel: false,
                frequency: "d",
                service_code: 'yf',
                codes: ["GC=F", "HG=F", "CL=F", "ZC=F", "ZW=F", "KC=F", "SB=F", "CC=F", "BTC=F"],
                alias: ["GC", "HG", "CL", "玉米", "小麦", "咖啡", "糖", "可可", "BTC"],
                res: null
            },
            market: {
                name: "宽基【美】",
                rel: false,
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["VTI.US", "DIA.US", "OEF.US", "MDY.US", "SPY.US", "QQQ.US", "QTEC.US", "IWB.US", "IWM.US"],
                res: null
            },
            gv: {
                name: "价值&成长【美】",
                rel: false,
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["IVW.US", "IVE.US", "IWF.US", "IWD.US"],
                alias: ["SP价", "SP成", "Ru价", "Ru成"],
                res: null
            },
            industry_c: {
                name: "行业板块【中-上证】",
                frequency: "d",
                service_code: 'yf',
                codes: ["000001.SS", "000032.SZ", "000034.SZ", "000035.SZ", "000036.SZ", "000037.SZ", "000038.SZ", "000039.SZ", "000040.SZ",
                    "000042.SZ"],
                alias: ["上证", "能源", "工业", "可选", "消费", "医药", "金融", "信息", "电信", "央企"],
                res: null
            },
            blue_c: {
                name: "蓝筹【中】",
                frequency: "d",
                service_code: 'yf',
                codes: ["000001.SS", "600519.SS", "600600.SS", "601318.SS", "600887.SS", "603288.SS", "000538.SZ", "000333.SZ", "002594.SZ",
                    "601607.SS", "000002.SZ"],
                alias: ["上证", "茅台", "青啤", "平安", "伊利", "海天", "云药", "美的", "比亚", "上医", "万科"],
                res: null
            },
            china: {
                name: "IT【中概】",
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["QQQ.US", "BABA.US", "BIDU.US", "JD.US", "PDD.US", "NTES.US", "WB.US", "BILI.US", "TCOM.US"],
                alias: ["QQQ", "BABA", "BIDU", "JD", "PDD", "网易", "WB", "BILI", "携程"],
                res: null
            },
            thematic: {
                name: "主题【美】",
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["ARKK.US", "MOO.US", "BLOK.US", "ARKG.US", "IBUY.US", "MJ.US", "FFTY.US", "BOTZ.US"],
                alias: ["ARK", "农业", "区块", "基因", "IBUY", "大麻", "蓝筹", "AI"],
                res: null
            },
            treasuryBond: {
                name: "国债利率",
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["30USY.B", "10USY.B", "2USY.B", "10DEY.B", "10CNY.B"],
                alias: ["30USY", "10USY", "2USY", "10DEY", "10CNY"],
                res: null
            },
            tips: {
                name: "通胀",
                frequency: "d",
                service_code: 'pdr-stooq',
                codes: ["TIP.US", ],
                alias: ["US", ],
                res: null
            },
        })

        function update() {
            condition.loading = true
            new Promise((resolve, reject) => {
                let num = 0
                for (const key in sectors) {
                    num = num + 1
                    apis.capital_service_apis.query_k_json({
                        "service_code": sectors[key]['service_code'],
                        "codes": sectors[key]['codes'],
                        "start": dayjs(new Date()).subtract(condition.last, condition.cycle).format(template),
                        "end": dayjs(new Date()).format(template)
                    }).then(res => {
                        if (sectors[key]['service_code'] === 'pdr-stooq') {
                            sectors[key]['res'] = JSON.parse(JSON.stringify(res['data']).replaceAll('US', ''))
                        } else {
                            sectors[key]['res'] = res['data']
                        }

                        _this.$redrawVueMasonry();
                        num = num - 1
                        if (num === 0) {
                            resolve('end')
                        }
                    })
                }
            }).then(() => {
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
    max-width: 232px;
}
</style>