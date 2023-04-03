import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
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
    }
})
