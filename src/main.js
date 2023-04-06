import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/main.css'
import ECharts from 'vue-echarts'
import {use} from "echarts/core";
import {VueMasonryPlugin} from 'vue-masonry';
// 手动引入 ECharts 各模块来减小打包体积
import {
    CanvasRenderer
} from 'echarts/renderers'
import {
    BarChart, PieChart, LineChart
} from 'echarts/charts'
import {
    LegendComponent, TitleComponent,
    GridComponent,
    TooltipComponent, MarkPointComponent
} from 'echarts/components'

use([
    LegendComponent, TitleComponent,
    CanvasRenderer, BarChart, PieChart, LineChart,
    GridComponent, TooltipComponent, MarkPointComponent,
]);

createApp(App)
    .component('v-chart', ECharts)
    .use(router)
    .use(store)
    .use(VueMasonryPlugin)
    .mount('#app')
