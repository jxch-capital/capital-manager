import {index_routers} from './index_routers'

export const baseRoutes = [
    {
        path: '/',
        redirect: () => {
            return {path: '/index'}
        },
    },
    {
        path: '/index',
        name: 'Index',
        label: "首页",
        component: () => import('cc/IndexLayout.vue'),
        children: index_routers
    }
]
