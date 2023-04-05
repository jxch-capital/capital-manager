<template>
    <n-table :bordered="false" :single-line="false" :single-column="true" :bottom-bordered="false">
        <tbody>
        <tr v-for="(val, key) in sector['res']">
            <td :title="key">{{ key.substring(0, 6) }}</td>
            <td :style="{background: td_background(((val[val.length - 1].close - val[0].close) / val[0].close * 100).toFixed(2))}"
                :title="val[val.length - 1].close">
                {{ ((val[val.length - 1].close - val[0].close) / val[0].close * 100).toFixed(2) }}%
            </td>
            <td>
                <LineChart :close-arr="val.map((item) => item['close'])"/>
            </td>
            <td v-if="rel">
                <LineChart
                        :close-arr="val.map((item, inx) => Math.log(
                            Math.log((item['close'])) / Math.log(Object.values(sector['res'])[0][inx]['close'])
                            * Math.log((item['volume'])) / Math.log(Object.values(sector['res'])[0][inx]['volume'])
                            ))"/>
            </td>
        </tr>
        </tbody>
    </n-table>
</template>

<script>
import {defineComponent} from 'vue'
import LineChart from "vv/sectors/LineChart.vue";
import chroma from 'chroma-js'

export default defineComponent({
    name: "TableCharts",
    components: {LineChart},
    props: {
        sector: Object,
        rel: Boolean
    },
    setup() {
        const chroma_scale_green = chroma.scale(['White', 'green'])
        const chroma_scale_red = chroma.scale(['White', 'red'])

        function td_background(val) {
            if (val >= 0) {
                return chroma_scale_green(Math.log(val * 4) / 8).hex()
            } else {
                return chroma_scale_red(Math.log(-val * 4) / 8).hex()
            }
        }

        return {
            td_background
        }
    }
})

</script>

<style scoped>

</style>