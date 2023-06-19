import {
    createStore
} from 'vuex'
import {apis} from "@/api";

export default createStore({
    state: {
        data: {}
    },
    mutations: {
        setKJsonByStockPool(state: any, {key, value}) {
            state.data[key] = value;
        }
    },
    actions: {
        async getKJsonByStockPool({commit}, {key, stock_pool, start, end, message}) {
            try {
                const res = await apis.capital_service_apis.query_k_json_by_stock_pool({
                    stock_pool: stock_pool,
                    start: start,
                    end: end
                });
                commit('setKJsonByStockPool', {key, value: res.data});
            } catch (e) {
                console.log(e);
                message.warning('请检查网络并稍后重试，或查看控制台报错信息');
            }
        }
    }
})