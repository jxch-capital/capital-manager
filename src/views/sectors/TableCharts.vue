<template>
    <n-table :bordered="false" :single-line="false" :single-column="true" :bottom-bordered="false">
        <tbody>
        <tr v-for="(val, key) in sector['res']">
            <td>{{ key }}</td>
            <td :style="{background: td_background(((val[val.length - 1].close - val[0].close) / val[0].close * 100).toFixed(2))}">
                {{ ((val[val.length - 1].close - val[0].close) / val[0].close * 100).toFixed(2) }}%
            </td>
            <td>
                <LineChart :close-arr="val.map((item) => item['close'])"/>
            </td>
            <td>
                <LineChart :close-arr="val.map((item, inx) => (item['close'] * item['volume']) / (Object.values(sector['res'])[0][inx]['close'] * (Object.values(sector['res'])[0][inx]['volume'])))"/>
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
        sector: Object
    },
    setup() {
        const chroma_scale_green = chroma.scale(['White', 'green'])
        const chroma_scale_red = chroma.scale(['White', 'red'])

        function td_background(val) {
            if (val >= 0) {
                return chroma_scale_green(Math.log(val) / 5).hex()
            } else {
                return chroma_scale_red(Math.log(-val) / 5).hex()
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