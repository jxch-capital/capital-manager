import axios from 'axios'

const capital_service_api = axios.create({
    baseURL: '/capital_service_api',
    timeout: 10000,
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json;charset=utf-8'}
})


export const query_k_json = (params: Object) => capital_service_api.post(`/base/query_k_json`, JSON.stringify(params))
export const query_breath_json = (params: Object) => capital_service_api.post(`/base/query_breath_json`, JSON.stringify(params))


export const capital_service_apis = {
    query_k_json,
    query_breath_json
}


