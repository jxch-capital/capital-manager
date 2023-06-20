import {
    createStore
} from 'vuex'
import {apis} from "@/api";

export default createStore({
    state: {
        stockPool: {},
        stockPoolData: {}
    },
    mutations: {
        setKJsonByStockPool(state: any, {key, value}) {
            state.stockPoolData[key] = value;
        },
        setStockPool(state: any, {pool}) {
            state.stockPool = pool;
        },
    },
    actions: {

    }
})