import {Component, h} from "vue";
import {NIcon} from "naive-ui";
import {
    Calculator as Calculator,
    TrendingUp as TrendingUp,
} from '@vicons/ionicons5'

function renderIcon(icon: Component) {
    return () => h(NIcon, null, {default: () => h(icon)})
}


export const index_routers = [
    {
        path: '/sectors-china',
        label: "中国板块",
        name: 'sectors-china',
        key: 'sectors-china',
        icon: renderIcon(TrendingUp),
        component: () => import('vv/sectors/SectorsChina.vue'),
    }, {
        path: '/calculator',
        label: "计算器",
        name: 'calculator',
        key: 'calculator',
        icon: renderIcon(Calculator),
        component: () => import('vv/calculators/Calculator.vue'),
    },
]