<template>
    <n-table size="small" :bordered="false" :single-line="true" :single-column="true" :bottom-bordered="false">
        <tbody>
        <tr v-for="(val, key, index) in sector['res']">
            <td v-if="sector['alias']" :title="key" nowrap="nowrap">{{ sector['alias'][index].substring(0, 6) }}</td>
            <td v-else :title="key" nowrap="nowrap">{{ key.substring(0, 6) }}</td>
            <td :style="{background: td_background(((val[val.length - 1].close - val[0].close) / val[0].close * 100).toFixed(2))}"
                :title="val[val.length - 1].close" nowrap="nowrap">
                {{ ((val[val.length - 1].close - val[0].close) / val[0].close * 100).toFixed(2) }}%
            </td>
            <td>
                <LineChart size="small" :close-arr="val.map((item) => item['close'])"/>
            </td>
            <td v-if="rel">
                <LineChart size="small"
                        :close-arr="val.map((item, inx) => Math.log(
                            Math.log((item['close'])) / Math.log(Object.values(sector['res'])[0][inx]['close'])
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