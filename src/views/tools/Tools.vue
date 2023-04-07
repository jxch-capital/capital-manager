<template>
    <div class="tools-card-con">
        <div v-masonry fit-width="true" transition-duration="1s" item-selector=".tools-card" origin-left="false">
            <div v-masonry-tile v-for="(val) in tools.links" :key="val['name']" class="card">
                <n-card size="small" :title="val['name']" hoverable style="width: 200px">
                    <n-a :href="val['link']" target="_blank" :title="val['link']">
                        {{ val['link'].substring(0, 20) }}...
                    </n-a>
                </n-card>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent, reactive, toRefs, toRaw} from 'vue'

export default defineComponent({
    name: "Tools",
    setup() {
        const tools = reactive({
            links: [{
                name: 'StockMap',
                link: 'https://finviz.com/map.ashx?t=sec_all&st=w13',
            }, {
                name: '经济指标',
                link: 'https://zh.tradingeconomics.com/united-states/indicators',
            }, {
                name: '大基金跟踪',
                link: 'https://dataroma.com/m/home.php',
            }, {
                name: 'MarketDashboard',
                link: 'https://www.trading-logic.com/MarketDashboard.html',
            }, {
                name: 'Breadth',
                link: 'https://dev.breadth.app/breadth',
            }, {
                name: '交易记录',
                link: 'https://thetagang.com/',
            }
            ]
        })

        return {
            tools
        }
    }
})
</script>

<style scoped>
.tools-card-con {
    width: 100%;
}

.tools-card {
    width: 100%;
    max-width: 232px;
}
</style>