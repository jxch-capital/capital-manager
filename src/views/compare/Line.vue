<template>
    <v-chart ref="line-chart" class="line-chart" :option="chartOptions"/>
</template>

<script>
import {defineComponent, reactive, toRaw, toRefs, watch, getCurrentInstance, onMounted} from "vue";
import dayjs from "dayjs";
import chroma from "chroma-js";

export default defineComponent({
    name: "Line",

    props: {
        data: Object,
        dataLabel: String,
        showLabel: String,
        title: String,
        compareFunc: String,
        sorted: Boolean,
    },
    setup(props) {
        const {data, dataLabel, showLabel, title} = toRefs(props)

        const chroma_scale_green = chroma.scale(['#F0FA18', '#18FA26'])
        const chroma_scale_red = chroma.scale(['#F0FA18', '#FF6546'])

        function td_background(val) {
            if (val >= 0) {
                return chroma_scale_green(val / 60).hex()
            } else {
                return chroma_scale_red(Math.abs(val) / 60).hex()
            }
        }

        const chartOptions = reactive({
            title: {
                text: title
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    params.sort(function (a, b) {
                        return Number(b.value[1]) - Number(a.value[1])
                    });
                    const date = params[0].axisValue.replace('\n', '/')
                    return '<h3>' + date + ' ('+ dayjs(date).day() +')' + '</h3>' +
                        '<table cellspacing="0" cellpadding=""><tr>' + params.map(item => '<td>' + item.marker + '</td><td>' +
                            item.seriesName.padEnd(20) + '</td><td style="background: ' + td_background(item.value[1]) + '">' + item.value[1] + '</td>').join('</tr><tr>') +
                        '</tr></table>'
                }
            },
            legend: {
                data: []
            },
            grid: {
                left: '0',
                right: '0',
                bottom: '0',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
            },
            yAxis: {
                type: 'value',
            },
            series: []
        })

        function doCompare(data) {
            const compareFunction = toRaw(props.compareFunc)
            const rawShowLabel = toRaw(props.showLabel)
            if (compareFunction) {
                if (compareFunction === 'pre-com') {
                    const newData = {}
                    for (const key in data) {
                        const open = data[key][0]['open']
                        newData[key] = data[key].map(item => {
                            item[rawShowLabel] = ((item[rawShowLabel] - open) / open * 100).toFixed(2)
                            return item
                        })
                    }
                    chartOptions.yAxis['name'] = '%'
                    return newData
                }
            }
            return data
        }

        let chartDemo = getCurrentInstance().refs['line-chart']

        onMounted(() => {
            chartDemo = getCurrentInstance().refs['line-chart']
        })

        watch(() => props.data, (newData) => {
            const rawShowLabel = toRaw(props.showLabel)
            const data = doCompare(toRaw(newData))
            const series = []
            for (const code in data) {
                series.push({
                    name: code,
                    type: 'line',
                    data: data[code].map(item =>
                        [dayjs(item[toRaw(props.dataLabel)]).format('YYYY\nMM/DD'), item[rawShowLabel]]),
                    symbolSize: 0,
                })
            }

            chartOptions.series = series
            chartOptions.legend.data = Object.keys(data)

            chartDemo.setOption(chartOptions, true)
        })

        return {
            chartOptions
        }
    }
})
</script>

<style scoped>

.line-chart {
    height: 100%;
    width: 100%;
}

</style>