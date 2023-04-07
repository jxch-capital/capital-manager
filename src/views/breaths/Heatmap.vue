<template>
    <div class="heatmap-chart-container">
        <v-chart :option="chartOptions" class="heatmap-chart"/>
    </div>
</template>

<script>
import {defineComponent, reactive, toRefs, toRaw} from 'vue'

export default defineComponent({
    name: "Heatmap",
    props: {
        x: Array,
        y: Array,
        heatmapData: Array,
    },
    setup(props) {
        const {x} = toRefs(props)
        const {y} = toRefs(props)
        const {heatmapData} = toRefs(props)

        const chartOptions = reactive({
            tooltip: {
                position: 'top',
            },
            grid: {
                top: "0%",
                right: "0%",
                bottom: "0%",
                left: "0%",
            },
            xAxis: {
                type: 'category',
                data: x,
                show: false,
                splitArea: {
                    show: false
                }
            },
            yAxis: {
                type: 'category',
                data: y,
                show: false,
                splitArea: {
                    show: false
                }
            },
            visualMap: {
                min: 0,
                max: 100,
                calculable: true,
                show: false,
                orient: 'horizontal',
                left: 'center',
                bottom: '15%',
                inRange: {
                    color: ['#FF6546', '#F0FA18', '#18FA26'] //From smaller to bigger value ->
                }
            },
            series: [
                {
                    name: '分数',
                    type: 'heatmap',
                    data: heatmapData,
                    label: {
                        show: false
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 6,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        })

        return {
            chartOptions
        }
    }
})
</script>

<style scoped>
.heatmap-chart-container {
    position: relative;
    height: 100px;
    width: 800px;
}

.heatmap-chart {
    height: 100%;
    width: 100%;
}
</style>