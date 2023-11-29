import vue from '@vitejs/plugin-vue'
import viteSvgIcons from 'vite-plugin-svg-icons'
import path from 'path'
import vitePluginCompression from 'vite-plugin-compression'
import ViteComponents from 'unplugin-vue-components/vite'
import {NaiveUiResolver} from 'unplugin-vue-components/resolvers'

import vueJsx from '@vitejs/plugin-vue-jsx'

export default () => {
    return {
        base: './',
        plugins: [
            vue(),
            // vitePluginCompression({
            //     threshold: 1024 * 10,
            // }),
            ViteComponents({
                resolvers: [NaiveUiResolver()],
            }),
            // vueJsx(),
        ],
        // css: {
        //     preprocessorOptions: {
        //         scss: {
        //             additionalData: '@use "./src/styles/variables.scss" as *;',
        //         },
        //     },
        // },
        resolve: {
            alias: [{
                find: '@',
                replacement: path.resolve(__dirname, 'src'),
            }, {
                find: 'vv',
                replacement: path.resolve(__dirname, 'src/views'),
            }, {
                find: 'api',
                replacement: path.resolve(__dirname, 'src/api'),
            }, {
                find: 'cc',
                replacement: path.resolve(__dirname, 'src/components'),
            },
            ]
        },
        server: {
            open: true,
            proxy: {
                "/capital_service_api": {
                    target: "http://jiangxicheng.site:15000",
                    // target: "http://127.0.0.1:5000",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/capital_service_api/, ''),
                },
                "/aktools": {
                    target: "http://8.142.100.222:18088",
                    // target: "http://127.0.0.1:5000",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/aktools/, ''),
                },
                "/capital_pa_api": {
                    target: "http://jiangxicheng.site:18088",
                    // target: "http://127.0.0.1:8080",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/capital_pa_api/, ''),
                },
            },
        },
    }
}
