import axios from 'axios'

const capital_service_api = axios.create({
    baseURL: '/capital_service_api',
    timeout: 30000,
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json;charset=utf-8'}
})


export const query_k_json = (params: Object) => capital_service_api.post(`/base/query_k_json`, JSON.stringify(params))
export const query_breath_json = (params: Object) => capital_service_api.post(`/base/query_breath_json`, JSON.stringify(params))
export const query_stock_pool = () => capital_service_api.post(`/base/query_stock_pool`)
export const query_k_json_by_stock_pool = (params: Object) => capital_service_api.post(`/base/query_k_json_by_stock_pool`, JSON.stringify(params))

export const capital_service_apis = {
    query_k_json,
    query_breath_json,
    query_stock_pool,
    query_k_json_by_stock_pool,
}


