<template>
    <div class="table-line-chart-container">
        <v-chart class="table-line-chart" :option="chartOptions"/>
    </div>
</template>

<script>
import {defineComponent, reactive, toRefs} from 'vue'

export default defineComponent({
    name: "LineChart",
    props: {
        closeArr: Array
    },
    setup(props) {
        const {closeArr} = toRefs(props)

        const chartOptions = reactive({
            backgroundColor: "#fff",
            tooltip: {
                show: false,
                trigger: "axis",
                backgroundColor: "rgba(72,179,255,0.6)",
                axisPointer: {
                    animation: false,
                    lineStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: "#48b3ff"
                                },
                                {
                                    offset: 0.5,
                                    color: "#48b3ff"
                                },
                                {
                                    offset: 1,
                                    color: "#48b3ff"
                                }
                            ],
                            global: false
                        }
                    }
                }
            },
            grid: {
                top: "0%",
                left: "0%",
                right: "0%",
                bottom: "0%"
            },
            xAxis: {
                show: false, //不显示X轴坐标
                type: "category",
                boundaryGap: false,
                axisLine: {
                    //坐标轴轴线相关设置。数学上的x轴
                    show: true
                },
                data: [],
                axisLabel: {
                    interval: 0,
                    rotate: 90
                }
            },
            yAxis: {
                type: "value",
                name: "$",
                show: false, //不显示Y轴坐标
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: "rgba(131,101,101,0.2)",
                        type: "dashed"
                    }
                },
                min: "dataMin",
                max: "dataMax"
            },
            series: [
                {
                    name: "价格",
                    data: closeArr,
                    type: "line",
                    showSymbol: true,
                    symbol: "circle",
                    symbolSize: 1,
                    smooth: 0,
                    emphasis: {
                        scale: false
                    },
                    tooltip: {
                        show: true
                    },
                    lineStyle: {
                        color: "#000", // 线条颜色
                        width: 1
                    },
                    itemStyle: {
                        color: "#000"
                    },
                    markPoint: {
                        symbol: 'circle',
                        symbolSize: 3,
                        symbolKeepAspect: true,
                        data: [
                            {
                                type: 'max', name: '最大值',
                                itemStyle: {
                                    color: 'red',
                                }
                            },
                            {
                                type: 'min', name: '最小值',
                                itemStyle: {
                                    color: '#08f528',
                                }
                            }
                        ],
                        label: {
                            formatter: ''
                        },
                    }
                }
            ],
            animation: false
        })

        return {
            chartOptions
        }
    }
})
</script>

<style scoped>

.table-line-chart-container {
    position: relative;
    height: 20px;
    width: 80px;
}

.table-line-chart {
    height: 100%;
    width: 100%;
}

</style>