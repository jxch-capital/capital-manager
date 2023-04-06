import {Component, h} from "vue";
import {NIcon} from "naive-ui";
import {Calculator, TrendingUp} from '@vicons/ionicons5'
import {ChartLineSmooth} from '@vicons/carbon'

function renderIcon(icon: Component) {
    return () => h(NIcon, null, {default: () => h(icon)})
}


export const index_routers = [
    {
        path: '/breaths',
        label: "美股市场呼吸图",
        name: 'breaths',
        key: 'breaths',
        icon: renderIcon(ChartLineSmooth),
        component: () => import('vv/breaths/Breaths.vue'),
    }, {
        path: '/sectors-us',
        label: "美国板块",
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
    },
]