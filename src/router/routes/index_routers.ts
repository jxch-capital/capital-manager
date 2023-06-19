import {Component, h} from "vue";
import {NIcon} from "naive-ui";
import {Calculator, TrendingUp, PlaySkipBackOutline, PlaySkipBackCircleOutline} from '@vicons/ionicons5'
import {ChartMultiLine, ToolsAlt, HeatMap03, ChartBubblePacked} from '@vicons/carbon'
import {BubbleChartFilled} from '@vicons/material'

function renderIcon(icon: Component) {
    return () => h(NIcon, null, {default: () => h(icon)})
}


export const index_routers = [
    {
        path: '/market-bubble',
        label: "市场气泡图",
        name: 'market-bubble',
        key: 'market-bubble',
        icon: renderIcon(BubbleChartFilled),
        component: () => import('vv/bubble/MarketBubble.vue'),
    },{
        path: '/abnormal-bubble',
        label: "异动气泡图",
        name: 'abnormal-bubble',
        key: 'abnormal-bubble',
        icon: renderIcon(ChartBubblePacked),
        component: () => import('vv/bubble/AbnormalBubble.vue'),
    },{
        path: '/compare',
        label: "趋势比较",
        name: 'compare',
        key: 'compare',
        icon: renderIcon(ChartMultiLine),
        component: () => import('vv/compare/Compare.vue'),
    },{
        path: '/k_back_m',
        label: "日内回放",
        name: 'k_back_m',
        key: 'k_back_m',
        icon: renderIcon(PlaySkipBackCircleOutline),
        component: () => import('vv/back/KBackM.vue'),
    }, {
        path: '/k_back_d',
        label: "日线回放",
        name: 'k_back_d',
        key: 'k_back_d',
        icon: renderIcon(PlaySkipBackOutline),
        component: () => import('vv/back/KBackD.vue'),
    }, {
        path: '/breaths',
        label: "美股市场呼吸图",
        name: 'breaths',
        key: 'breaths',
        icon: renderIcon(HeatMap03),
        component: () => import('vv/breaths/Breaths.vue'),
    }, {
        path: '/sectors-us',
        label: "板块图",
        name: 'sectors-us',
        key: 'sectors-us',
        icon: renderIcon(TrendingUp),
        component: () => import('vv/sectors/Sectors.vue'),
    }, {
        path: '/calculator',
        label: "计算器",
        name: 'calculator',
        key: 'calculator',
        icon: renderIcon(Calculator),
        component: () => import('vv/calculators/Calculator.vue'),
    },{
        path: '/tools',
        label: "市场大地图",
        name: 'tools',
        key: 'tools',
        icon: renderIcon(ToolsAlt),
        component: () => import('vv/tools/Tools.vue'),
    },
]