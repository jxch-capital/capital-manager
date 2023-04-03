
export const constantRoutes = [
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/exception/404.vue'),
        meta: {
            hidden: true,
        },
    },
    {
        path: '/500',
        name: '500',
        component: () => import('@/views/exception/500.vue'),
        meta: {
            hidden: true,
        },
    },
    {
        path: '/403',
        name: '403',
        component: () => import('@/views/exception/403.vue'),
        meta: {
            hidden: true,
        },
    },
]
