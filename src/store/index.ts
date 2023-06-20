import {
    createStore
} from 'vuex'
import {apis} from "@/api";

export default createStore({
    state: {
        stockPoolData: {}
    },
    mutations: {
        setKJsonByStockPool(state: any, {key, value}) {
            state.stockPoolData[key] = value;
        }
    },
    actions: {

    }
})