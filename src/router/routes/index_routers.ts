import {Component, h} from "vue";
import {NIcon} from "naive-ui";
import {Calculator, TrendingUp, PlaySkipBackOutline} from '@vicons/ionicons5'
import {ChartLineSmooth, ToolsAlt} from '@vicons/carbon'

function renderIcon(icon: Component) {
    return () => h(NIcon, null, {default: () => h(icon)})
}


export const index_routers = [
    {
        path: '/k_back_1d',
        label: "日线回放",
        name: 'k_back_1d',
        key: 'k_back_1d',
        icon: renderIcon(PlaySkipBackOutline),
        component: () => import('vv/back/KBack1D.vue'),
    }, {
        path: '/breaths',
        label: "美股市场呼吸图",
        name: 'breaths',
        key: 'breaths',
        icon: renderIcon(ChartLineSmooth),
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