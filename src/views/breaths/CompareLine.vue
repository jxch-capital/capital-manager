<template>
    <div class="sum-line-chart-container">
        <v-chart :option="chartOptions"/>
    </div>
</template>

<script>
import {defineComponent, reactive, toRefs} from 'vue'

export default defineComponent({
    name: "CompareLine",
    props: {
        title: String,
        subTitle: String,
        dateArr: Array,
        scoreArr: Array,
        sectorClose: Array
    },
    setup(props) {
        const {title} = toRefs(props)
        const {subTitle} = toRefs(props)
        const {scoreArr} = toRefs(props)
        const {dateArr} = toRefs(props)
        const {sectorClose} = toRefs(props)

        const chartOptions = reactive({
            title:{text:title, subtext: subTitle},
            tooltip: {
                trigger: 'axis',
            },
            toolbox: {
                show: true,
            },
            grid: {
                top: "20%",
                left: "10%",
                right: "10%",
                bottom: "10%"
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                show: false,
                data: dateArr
            },
            yAxis: [{
                type: 'value',
                show: false,
                axisLabel: {
                    formatter: '{value} W'
                },
                axisPointer: {
                    snap: true
                },
                min: "dataMin",
                max: "dataMax"
            }, {
                type: 'value',
                show: false,
                axisLabel: {
                    formatter: '{value} W'
                },
                axisPointer: {
                    snap: true
                },
                min: "dataMin",
                max: "dataMax"
            }],
            series: [{
                name: 'SPY',
                type: 'line',
                yAxisIndex: 1,
                data: sectorClose,
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
                    color: "#bb9046", // 线条颜色
                    width: 1
                },
                markPoint: {
                    symbol: 'circle',
                    symbolSize: 4,
                    symbolKeepAspect: true,
                    data: [
                        {
                            type: 'max', name: '最大值',
                            itemStyle: {
                                color: '#08f528',
                            }
                        },
                        {
                            type: 'min', name: '最小值',
                            itemStyle: {
                                color: 'red',
                            }
                        }
                    ],
                    label: {
                        formatter: ''
                    },
                }
            }, {
                name: '总分',
                type: 'line',
                yAxisIndex: 0,
                smooth: 0,
                showSymbol: true,
                symbol: "circle",
                symbolSize: 0,
                data: scoreArr,
                markArea: {
                    itemStyle: {
                        color: 'black'
                    },
                },
                emphasis: {
                    scale: false
                },
                markPoint: {
                    symbol: 'circle',
                    symbolSize: 5,
                    symbolKeepAspect: true,
                    data: [
                        {
                            type: 'max', name: '最大值',
                            itemStyle: {
                                color: '#FE0DE5',
                            }
                        },
                        {
                            type: 'min', name: '最小值',
                            itemStyle: {
                                color: '#FE0DE5',
                            }
                        }
                    ],
                    label: {
                        formatter: ''
                    },
                },
                lineStyle: {
                    normal: {
                        width: 2,
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 1,
                                color: '#FF6546'
                            }, {
                                offset: 0.5,
                                color: '#F0FA18'
                            }, {
                                offset: 0,
                                color: '#18FA26'
                            }],
                            global: false
                        }
                    }
                }
            },
            ]
        });

        return {
            chartOptions
        }
    }
})
</script>

<style scoped>
.sum-line-chart-container {
    position: relative;
    height: 100px;
    width: 800px;
}

.sum-line-chart {
    height: 100%;
    width: 100%;
}
</style>