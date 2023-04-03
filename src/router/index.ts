import {App} from 'vue'
import {createRouter, createWebHashHistory} from 'vue-router'
import {constantRoutes} from './routes/constants'
import {baseRoutes} from './routes/base'


const router = createRouter({
    history: createWebHashHistory(),
    routes: [...baseRoutes, ...constantRoutes],
})

export function useAppRouter(app: App) {
    app.use(router)
}

export default router
