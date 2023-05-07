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
    BarChart, PieChart, LineChart, HeatmapChart,CandlestickChart,
} from 'echarts/charts'
import {
    LegendComponent, TitleComponent,
    GridComponent,ToolboxComponent,
    TooltipComponent, MarkPointComponent,
    VisualMapComponent,DataZoomComponent,DatasetComponent,
} from 'echarts/components'

use([
    LegendComponent, TitleComponent,ToolboxComponent,
    CanvasRenderer, BarChart, PieChart, LineChart,
    GridComponent, TooltipComponent, MarkPointComponent,
    VisualMapComponent, HeatmapChart,CandlestickChart,
    DataZoomComponent,DatasetComponent,
]);

createApp(App)
    .component('v-chart', ECharts)
    .use(router)
    .use(store)
    .use(VueMasonryPlugin)
    .mount('#app')
